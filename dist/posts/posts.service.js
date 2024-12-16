"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const posts_entity_1 = require("./posts.entity");
const players_entity_1 = require("../players/players.entity");
const categories_entity_1 = require("../categories/categories.entity");
const genres_entity_1 = require("../genres/genres.entity");
const directors_entity_1 = require("../directors/directors.entity");
const casts_entity_1 = require("../casts/casts.entity");
var postStatus;
(function (postStatus) {
    postStatus["PUBLISH"] = "publish";
    postStatus["DRAFT"] = "draft";
    postStatus["REVISION"] = "revision";
})(postStatus || (postStatus = {}));
var postType;
(function (postType) {
    postType["MOVIE"] = "movie";
    postType["SERIES"] = "series";
    postType["EPISODE"] = "episode";
})(postType || (postType = {}));
var postOrder;
(function (postOrder) {
    postOrder["TITLE"] = "title";
    postOrder["TYPE"] = "type";
    postOrder["CREATED_AT"] = "created_at";
    postOrder["STATUS"] = "status";
})(postOrder || (postOrder = {}));
let PostsService = class PostsService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger("PostsService");
        this.postRepository = this.dataSource.getRepository(posts_entity_1.PostEntity);
        this.playerRepository = this.dataSource.getRepository(players_entity_1.PlayerEntity);
        this.categoryRepository = this.dataSource.getRepository(categories_entity_1.CategorieEntity);
        this.genreRepository = this.dataSource.getRepository(genres_entity_1.GenreEntity);
        this.directorRepository = this.dataSource.getRepository(directors_entity_1.DirectorEntity);
        this.castRepository = this.dataSource.getRepository(casts_entity_1.CastEntity);
    }
    async toSlug(string) {
        return string
            .toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-");
    }
    async getAll(take = 10, skip = 0, type = null, status = null, search = null, created_at = null, orderby = postOrder.CREATED_AT, order = "DESC") {
        try {
            const query = this.postRepository
                .createQueryBuilder("post")
                .take(take);
            if (skip)
                query.skip(skip);
            if (type)
                query.andWhere("post.type = :type", { type });
            if (status)
                query.andWhere("post.status = :status", { status });
            if (created_at)
                query.andWhere("post.created_at = :created_at", { created_at });
            if (search)
                query.andWhere("post.title LIKE :search", { search: `%${search}%` });
            const get = await query.orderBy(`post.${orderby}`, order).getMany();
            return {
                status: "ok",
                data: get,
                message: "Posts retrieved successfully.",
            };
        }
        catch (error) {
            this.logger.error(`Failed to get posts: ${error.message}`);
            throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
        }
    }
    async countPosts() {
        try {
            const total = await this.postRepository.createQueryBuilder("post").getCount();
            const publish = await this.postRepository
                .createQueryBuilder("post")
                .where({
                status: postStatus.PUBLISH,
            })
                .getCount();
            const draft = await this.postRepository
                .createQueryBuilder("post")
                .where({
                status: postStatus.DRAFT,
            })
                .getCount();
            const revision = await this.postRepository
                .createQueryBuilder("post")
                .where({
                status: postStatus.REVISION,
            })
                .getCount();
            return {
                status: "ok",
                data: { total, publish, draft, revision },
                message: "Drive accounts counted successfully.",
            };
        }
        catch (error) {
            this.logger.error(error.message);
            throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
        }
    }
    async getPost(id) {
        try {
            id = Number(id);
            if (isNaN(id))
                throw new common_1.NotFoundException({ status: "error", message: "Invalid post id." });
            const find = await this.postRepository.findOne({
                where: { id: Number(id) },
                cache: true,
            });
            if (!find)
                throw new common_1.NotFoundException({ status: "error", message: "Post not found." });
            return { status: "ok", data: find, message: "Post retrieved successfully." };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            else {
                this.logger.error(error.message);
                throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }
    async findPostBySlug(slug) {
        try {
            const find = await this.postRepository.findOne({
                where: { slug },
                cache: true,
            });
            if (!find)
                throw new common_1.NotFoundException({ status: "error", message: "Post not found." });
            return { status: "ok", data: find, message: "Post retrieved successfully." };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            else {
                this.logger.error(error.message);
                throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }
    async createPost(data) {
        try {
            if (data.type != postType.SERIES) {
                if (!data.player)
                    throw new common_1.BadRequestException({ status: "error", message: "Player is required." });
                const player = await this.playerRepository.findOneBy({ code: data.player });
                if (!player)
                    throw new common_1.NotFoundException({ status: "error", message: "Player not found." });
                data.player = player;
            }
            else {
                if (!data.airing)
                    throw new common_1.NotFoundException({ status: "error", message: "Airing is required." });
            }
            if (data.type != postType.EPISODE) {
                if (!data.poster)
                    throw new common_1.BadRequestException({ status: "error", message: "Poster is required." });
                let existCategories = await this.categoryRepository.find({
                    where: { slug: (0, typeorm_1.In)(data.categories) },
                });
                existCategories = existCategories.map((cat) => cat.name);
                const newCategories = data.categories.filter((cat) => !existCategories.includes(cat));
                const allCategories = existCategories;
                if (newCategories.length) {
                    const createCategories = newCategories.map((cat) => {
                        return this.categoryRepository.create({ name: cat, slug: this.toSlug(cat) });
                    });
                    allCategories.concat(createCategories);
                }
                data.categories = allCategories;
                let existGenres = await this.genreRepository.find({
                    where: { slug: (0, typeorm_1.In)(data.genres) },
                });
                existGenres = existGenres.map((gen) => gen.name);
                const newGenres = data.genres.filter((gen) => !existGenres.includes(gen));
                const allGenres = existGenres;
                if (newGenres.length) {
                    const createGenres = newGenres.map((gen) => {
                        return this.genreRepository.create({ name: gen, slug: this.toSlug(gen) });
                    });
                    allGenres.concat(createGenres);
                }
                data.genres = allGenres;
                let director = await this.directorRepository.findOneBy({ name: data.director });
                if (!director) {
                    director = this.directorRepository.create({
                        name: data.director,
                        slug: this.toSlug(data.director),
                    });
                }
                data.director = director;
                let casts = await this.castRepository.find({ where: { name: (0, typeorm_1.In)(data.casts) } });
                casts = casts.map((cast) => cast.name);
                const newCasts = data.casts.filter((cast) => !casts.includes(cast));
                const allCasts = casts;
                if (newCasts.length) {
                    const createCasts = newCasts.map((cast) => {
                        return this.castRepository.create({ name: cast, slug: this.toSlug(cast) });
                    });
                    allCasts.concat(createCasts);
                }
                data.casts = allCasts;
            }
            else {
                if (!data.season)
                    throw new common_1.BadRequestException({ status: "error", message: "Season is required." });
                if (!data.episode)
                    throw new common_1.BadRequestException({ status: "error", message: "Episode is required." });
            }
            if (!data.slug)
                data.slug = await this.toSlug(data.title);
            const post = this.postRepository.create(data);
            await this.postRepository.save(post);
            return { status: "ok", data: post, message: "Post created successfully." };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            else {
                if (error.code == 23505)
                    return { status: "error", message: "Post slug already in used." };
                this.logger.error(error.message);
                throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }
    async updatePost(id, data) {
        try {
            id = Number(id);
            if (isNaN(id))
                throw new common_1.NotFoundException({ status: "error", message: "Invalid post id." });
            const post = await this.postRepository.findOne({
                where: { id: Number(id) },
                cache: true,
            });
            if (!post)
                throw new common_1.NotFoundException({ status: "error", message: "Post not found." });
            if (data.type != postType.SERIES) {
                if (!data.player)
                    throw new common_1.BadRequestException({ status: "error", message: "Player is required." });
                const player = await this.playerRepository.findOneBy({ code: data.player });
                if (!player)
                    throw new common_1.NotFoundException({ status: "error", message: "Player not found." });
                data.player = player;
            }
            else {
                if (!data.airing)
                    throw new common_1.NotFoundException({ status: "error", message: "Airing is required." });
            }
            if (data.type != postType.EPISODE) {
                if (!data.poster)
                    throw new common_1.BadRequestException({ status: "error", message: "Poster is required." });
                let existCategories = await this.categoryRepository.find({
                    where: { slug: (0, typeorm_1.In)(data.categories) },
                });
                existCategories = existCategories.map((cat) => cat.name);
                const newCategories = data.categories.filter((cat) => !existCategories.includes(cat));
                const allCategories = existCategories;
                if (newCategories.length) {
                    const createCategories = newCategories.map((cat) => {
                        return this.categoryRepository.create({ name: cat, slug: this.toSlug(cat) });
                    });
                    allCategories.concat(createCategories);
                }
                data.categories = allCategories;
                let existGenres = await this.genreRepository.find({
                    where: { slug: (0, typeorm_1.In)(data.genres) },
                });
                existGenres = existGenres.map((gen) => gen.name);
                const newGenres = data.genres.filter((gen) => !existGenres.includes(gen));
                const allGenres = existGenres;
                if (newGenres.length) {
                    const createGenres = newGenres.map((gen) => {
                        return this.genreRepository.create({ name: gen, slug: this.toSlug(gen) });
                    });
                    allGenres.concat(createGenres);
                }
                data.genres = allGenres;
                let director = await this.directorRepository.findOneBy({ name: data.director });
                if (!director) {
                    director = this.directorRepository.create({
                        name: data.director,
                        slug: this.toSlug(data.director),
                    });
                }
                data.director = director;
                let casts = await this.castRepository.find({ where: { name: (0, typeorm_1.In)(data.casts) } });
                casts = casts.map((cast) => cast.name);
                const newCasts = data.casts.filter((cast) => !casts.includes(cast));
                const allCasts = casts;
                if (newCasts.length) {
                    const createCasts = newCasts.map((cast) => {
                        return this.castRepository.create({ name: cast, slug: this.toSlug(cast) });
                    });
                    allCasts.concat(createCasts);
                }
                data.casts = allCasts;
            }
            else {
                if (!data.season)
                    throw new common_1.BadRequestException({ status: "error", message: "Season is required." });
                if (!data.episode)
                    throw new common_1.BadRequestException({ status: "error", message: "Episode is required." });
            }
            if (!data.slug)
                data.slug = await this.toSlug(data.title);
            await this.postRepository.update({ id }, data);
            return { status: "ok", data: post, message: "Post updated successfully." };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            else {
                if (error.code == 23505)
                    return { status: "error", message: "Post slug already in used." };
                this.logger.error(error.message);
                throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }
    async deletePost(id) {
        try {
            id = Number(id);
            if (isNaN(id))
                throw new common_1.NotFoundException({ status: "error", message: "Invalid post id." });
            const post = await this.postRepository.findOne({
                where: { id: Number(id) },
                cache: true,
            });
            if (!post)
                throw new common_1.NotFoundException({ status: "error", message: "Post not found." });
            await this.postRepository.delete({ id });
            return { status: "ok", data: post, message: "Post deleted successfully." };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            else {
                this.logger.error(error.message);
                throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PostsService);
//# sourceMappingURL=posts.service.js.map