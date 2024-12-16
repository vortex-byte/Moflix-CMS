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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const admin_auth_guard_1 = require("../auth/admin-auth.guard");
const posts_service_1 = require("./posts.service");
const create_dto_1 = require("./create.dto");
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
let PostsController = class PostsController {
    constructor(postsService) {
        this.postsService = postsService;
    }
    getAll(take, skip, type, status, search, created_at, orderby, order) {
        return this.postsService.getAll(take, skip, type, status, search, created_at, orderby, order);
    }
    countPosts() {
        return this.postsService.countPosts();
    }
    getPost(id) {
        return this.postsService.getPost(id);
    }
    findPostBySlug(slug) {
        return this.postsService.findPostBySlug(slug);
    }
    createPost(data) {
        return this.postsService.createPost(data);
    }
    updatePost(id, data) {
        return this.postsService.updatePost(id, data);
    }
    deletePost(id) {
        return this.postsService.deletePost(id);
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.Get)(""),
    __param(0, (0, common_1.Query)("take")),
    __param(1, (0, common_1.Query)("skip")),
    __param(2, (0, common_1.Query)("type")),
    __param(3, (0, common_1.Query)("status")),
    __param(4, (0, common_1.Query)("search")),
    __param(5, (0, common_1.Query)("created_at")),
    __param(6, (0, common_1.Query)("orderby")),
    __param(7, (0, common_1.Query)("order")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Date, String, String]),
    __metadata("design:returntype", Object)
], PostsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)("/count"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], PostsController.prototype, "countPosts", null);
__decorate([
    (0, common_1.Get)("/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], PostsController.prototype, "getPost", null);
__decorate([
    (0, common_1.Get)("slug/:slug"),
    __param(0, (0, common_1.Param)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], PostsController.prototype, "findPostBySlug", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dto_1.CreatePostDto]),
    __metadata("design:returntype", Object)
], PostsController.prototype, "createPost", null);
__decorate([
    (0, common_1.Put)("/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_dto_1.CreatePostDto]),
    __metadata("design:returntype", Object)
], PostsController.prototype, "updatePost", null);
__decorate([
    (0, common_1.Delete)("/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], PostsController.prototype, "deletePost", null);
exports.PostsController = PostsController = __decorate([
    (0, common_1.Controller)("posts"),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminGuard),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
//# sourceMappingURL=posts.controller.js.map