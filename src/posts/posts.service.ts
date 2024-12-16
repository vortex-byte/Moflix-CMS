import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    UnauthorizedException,
    Logger,
    BadRequestException,
} from "@nestjs/common";
import { In, DataSource } from "typeorm";
import { PostEntity } from "./posts.entity";
import { PlayerEntity } from "../players/players.entity";
import { CategorieEntity } from "../categories/categories.entity";
import { GenreEntity } from "../genres/genres.entity";
import { DirectorEntity } from "../directors/directors.entity";
import { CastEntity } from "../casts/casts.entity";
import { CreatePostDto } from "./create.dto";

enum postStatus {
    PUBLISH = "publish",
    DRAFT = "draft",
    REVISION = "revision",
}

enum postType {
    MOVIE = "movie",
    SERIES = "series",
    EPISODE = "episode",
}

enum postOrder {
    TITLE = "title",
    TYPE = "type",
    CREATED_AT = "created_at",
    STATUS = "status",
}

interface QueryResult {
    status: "ok" | "error";
    data?: any;
    message: string;
}

@Injectable()
export class PostsService {
    private postRepository;
    private playerRepository;
    private categoryRepository;
    private genreRepository;
    private directorRepository;
    private castRepository;
    private logger = new Logger("PostsService");

    constructor(private dataSource: DataSource) {
        this.postRepository = this.dataSource.getRepository(PostEntity);
        this.playerRepository = this.dataSource.getRepository(PlayerEntity);
        this.categoryRepository = this.dataSource.getRepository(CategorieEntity);
        this.genreRepository = this.dataSource.getRepository(GenreEntity);
        this.directorRepository = this.dataSource.getRepository(DirectorEntity);
        this.castRepository = this.dataSource.getRepository(CastEntity);
    }

    private async toSlug(string: string): Promise<string> {
        return string
            .toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-");
    }

    async getAll(
        take: number = 10,
        skip: number = 0,
        type: postType = null,
        status: postStatus = null,
        search: string = null,
        created_at: Date = null,
        orderby: postOrder = postOrder.CREATED_AT,
        order: "ASC" | "DESC" = "DESC"
    ): Promise<QueryResult> {
        try {
            const query = this.postRepository
                .createQueryBuilder("post")
                // .select([
                //     "post.id",
                //     "post.title",
                //     "post.type",
                //     "post.player",
                //     "post.phone",
                //     "post.country",
                //     "post.status",
                //     "post.updated_at",
                // ])
                .take(take);

            if (skip) query.skip(skip);
            if (type) query.andWhere("post.type = :type", { type });
            if (status) query.andWhere("post.status = :status", { status });
            if (created_at) query.andWhere("post.created_at = :created_at", { created_at });
            if (search) query.andWhere("post.title LIKE :search", { search: `%${search}%` });

            const get = await query.orderBy(`post.${orderby}`, order).getMany();
            return {
                status: "ok",
                data: get,
                message: "Posts retrieved successfully.",
            };
        } catch (error) {
            this.logger.error(`Failed to get posts: ${error.message}`);
            throw new InternalServerErrorException({ status: "error", message: error.message });
        }
    }

    async countPosts(): Promise<QueryResult> {
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
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException({ status: "error", message: error.message });
        }
    }

    async getPost(id: number): Promise<QueryResult> {
        try {
            id = Number(id);
            if (isNaN(id)) throw new NotFoundException({ status: "error", message: "Invalid post id." });

            const find = await this.postRepository.findOne({
                where: { id: Number(id) },
                cache: true,
            });

            if (!find) throw new NotFoundException({ status: "error", message: "Post not found." });

            return { status: "ok", data: find, message: "Post retrieved successfully." };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                this.logger.error(error.message);
                throw new InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }

    async findPostBySlug(slug: string): Promise<QueryResult> {
        try {
            const find = await this.postRepository.findOne({
                where: { slug },
                cache: true,
            });

            if (!find) throw new NotFoundException({ status: "error", message: "Post not found." });

            return { status: "ok", data: find, message: "Post retrieved successfully." };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                this.logger.error(error.message);
                throw new InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }

    async createPost(data: CreatePostDto): Promise<QueryResult> {
        try {
            if (data.type != postType.SERIES) {
                if (!data.player) throw new BadRequestException({ status: "error", message: "Player is required." });
                const player = await this.playerRepository.findOneBy({ code: data.player });
                if (!player) throw new NotFoundException({ status: "error", message: "Player not found." });
                data.player = player;
            } else {
                if (!data.airing) throw new NotFoundException({ status: "error", message: "Airing is required." });
            }

            if (data.type != postType.EPISODE) {
                if (!data.poster) throw new BadRequestException({ status: "error", message: "Poster is required." });

                let existCategories = await this.categoryRepository.find({
                    where: { slug: In(data.categories) },
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
                    where: { slug: In(data.genres) },
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

                let casts = await this.castRepository.find({ where: { name: In(data.casts) } });
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
            } else {
                if (!data.season) throw new BadRequestException({ status: "error", message: "Season is required." });
                if (!data.episode) throw new BadRequestException({ status: "error", message: "Episode is required." });
            }

            if (!data.slug) data.slug = await this.toSlug(data.title);

            const post = this.postRepository.create(data);
            await this.postRepository.save(post);
            return { status: "ok", data: post, message: "Post created successfully." };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            } else {
                if (error.code == 23505) return { status: "error", message: "Post slug already in used." };
                this.logger.error(error.message);
                throw new InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }

    async updatePost(id: number, data: CreatePostDto): Promise<QueryResult> {
        try {
            id = Number(id);
            if (isNaN(id)) throw new NotFoundException({ status: "error", message: "Invalid post id." });

            const post = await this.postRepository.findOne({
                where: { id: Number(id) },
                cache: true,
            });

            if (!post) throw new NotFoundException({ status: "error", message: "Post not found." });

            if (data.type != postType.SERIES) {
                if (!data.player) throw new BadRequestException({ status: "error", message: "Player is required." });
                const player = await this.playerRepository.findOneBy({ code: data.player });
                if (!player) throw new NotFoundException({ status: "error", message: "Player not found." });
                data.player = player;
            } else {
                if (!data.airing) throw new NotFoundException({ status: "error", message: "Airing is required." });
            }

            if (data.type != postType.EPISODE) {
                if (!data.poster) throw new BadRequestException({ status: "error", message: "Poster is required." });

                let existCategories = await this.categoryRepository.find({
                    where: { slug: In(data.categories) },
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
                    where: { slug: In(data.genres) },
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

                let casts = await this.castRepository.find({ where: { name: In(data.casts) } });
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
            } else {
                if (!data.season) throw new BadRequestException({ status: "error", message: "Season is required." });
                if (!data.episode) throw new BadRequestException({ status: "error", message: "Episode is required." });
            }

            if (!data.slug) data.slug = await this.toSlug(data.title);

            await this.postRepository.update({ id }, data);
            return { status: "ok", data: post, message: "Post updated successfully." };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            } else {
                if (error.code == 23505) return { status: "error", message: "Post slug already in used." };
                this.logger.error(error.message);
                throw new InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }

    async deletePost(id: number): Promise<QueryResult> {
        try {
            id = Number(id);
            if (isNaN(id)) throw new NotFoundException({ status: "error", message: "Invalid post id." });

            const post = await this.postRepository.findOne({
                where: { id: Number(id) },
                cache: true,
            });

            if (!post) throw new NotFoundException({ status: "error", message: "Post not found." });

            await this.postRepository.delete({ id });
            return { status: "ok", data: post, message: "Post deleted successfully." };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                this.logger.error(error.message);
                throw new InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }
}
