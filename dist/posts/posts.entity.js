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
exports.PostEntity = void 0;
const typeorm_1 = require("typeorm");
const players_entity_1 = require("../players/players.entity");
const genres_entity_1 = require("../genres/genres.entity");
const categories_entity_1 = require("../categories/categories.entity");
const directors_entity_1 = require("../directors/directors.entity");
const casts_entity_1 = require("../casts/casts.entity");
var PostStatus;
(function (PostStatus) {
    PostStatus["PUBLISH"] = "publish";
    PostStatus["DRAFT"] = "draft";
    PostStatus["REVISION"] = "revision";
})(PostStatus || (PostStatus = {}));
var PostType;
(function (PostType) {
    PostType["MOVIE"] = "movie";
    PostType["SERIES"] = "series";
    PostType["EPISODE"] = "episode";
})(PostType || (PostType = {}));
var AiringType;
(function (AiringType) {
    AiringType["ONGOING"] = "ongoing";
    AiringType["COMPLETED"] = "completed";
})(AiringType || (AiringType = {}));
let PostEntity = class PostEntity {
};
exports.PostEntity = PostEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PostEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => players_entity_1.PlayerEntity, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        cascade: true,
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", players_entity_1.PlayerEntity)
], PostEntity.prototype, "player", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PostEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], PostEntity.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: PostType,
    }),
    __metadata("design:type", String)
], PostEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: AiringType,
        default: null,
        nullable: true,
    }),
    __metadata("design:type", String)
], PostEntity.prototype, "airing", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], PostEntity.prototype, "synopsis", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => categories_entity_1.CategorieEntity, (category) => category.posts, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        cascade: true,
        eager: true,
        nullable: true,
    }),
    (0, typeorm_1.JoinTable)({
        name: "post_categories",
        joinColumn: { name: "post_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "category_id", referencedColumnName: "id" },
    }),
    __metadata("design:type", Array)
], PostEntity.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => genres_entity_1.GenreEntity, (genre) => genre.posts, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        cascade: true,
        eager: true,
        nullable: true,
    }),
    (0, typeorm_1.JoinTable)({
        name: "post_genres",
        joinColumn: { name: "post_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "genre_id", referencedColumnName: "id" },
    }),
    __metadata("design:type", Array)
], PostEntity.prototype, "genres", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], PostEntity.prototype, "poster", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], PostEntity.prototype, "season", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], PostEntity.prototype, "episode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], PostEntity.prototype, "released", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], PostEntity.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], PostEntity.prototype, "voters", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], PostEntity.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => directors_entity_1.DirectorEntity, (director) => director.posts, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        cascade: true,
        eager: true,
        nullable: true,
    }),
    __metadata("design:type", directors_entity_1.DirectorEntity)
], PostEntity.prototype, "director", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => casts_entity_1.CastEntity, (cast) => cast.posts, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        cascade: true,
        eager: true,
        nullable: true,
    }),
    (0, typeorm_1.JoinTable)({
        name: "post_casts",
        joinColumn: { name: "post_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "cast_id", referencedColumnName: "id" },
    }),
    __metadata("design:type", Array)
], PostEntity.prototype, "casts", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], PostEntity.prototype, "trailer", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: PostStatus,
        default: PostStatus.DRAFT,
    }),
    __metadata("design:type", String)
], PostEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PostEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PostEntity.prototype, "updated_at", void 0);
exports.PostEntity = PostEntity = __decorate([
    (0, typeorm_1.Entity)("post")
], PostEntity);
//# sourceMappingURL=posts.entity.js.map