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
exports.DirectorEntity = void 0;
const typeorm_1 = require("typeorm");
const posts_entity_1 = require("../posts/posts.entity");
let DirectorEntity = class DirectorEntity {
};
exports.DirectorEntity = DirectorEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DirectorEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DirectorEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], DirectorEntity.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => posts_entity_1.PostEntity, (post) => post.director),
    __metadata("design:type", Array)
], DirectorEntity.prototype, "posts", void 0);
exports.DirectorEntity = DirectorEntity = __decorate([
    (0, typeorm_1.Entity)("director")
], DirectorEntity);
//# sourceMappingURL=directors.entity.js.map