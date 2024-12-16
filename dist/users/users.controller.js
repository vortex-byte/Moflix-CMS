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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const admin_auth_guard_1 = require("../auth/admin-auth.guard");
const auth_decorator_1 = require("../auth/auth.decorator");
const users_service_1 = require("./users.service");
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["BANNED"] = "banned";
})(UserStatus || (UserStatus = {}));
var UserOrder;
(function (UserOrder) {
    UserOrder["NAME"] = "name";
    UserOrder["EMAIL"] = "email";
    UserOrder["CREATED_AT"] = "created_at";
    UserOrder["STATUS"] = "status";
})(UserOrder || (UserOrder = {}));
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    getAllMember(take, skip, status, search, orderby, order) {
        return this.usersService.getAllMember(take, skip, status, search, orderby, order);
    }
    getAllAdmin(take, skip, search, orderby, order) {
        return this.usersService.getAllAdmin(take, skip, search, orderby, order);
    }
    countMembers() {
        return this.usersService.countMembers();
    }
    countAdmin() {
        return this.usersService.countAdmin();
    }
    getUser(id) {
        return this.usersService.getUser(id);
    }
    findByEmail(email) {
        return this.usersService.findByEmail(email);
    }
    createUser(data) {
        return this.usersService.createUser(data);
    }
    updateUser(id, data) {
        return this.usersService.updateUser(id, data);
    }
    deleteUser(id) {
        return this.usersService.deleteUser(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)("/members"),
    __param(0, (0, common_1.Query)("take")),
    __param(1, (0, common_1.Query)("skip")),
    __param(2, (0, common_1.Query)("status")),
    __param(3, (0, common_1.Query)("search")),
    __param(4, (0, common_1.Query)("orderby")),
    __param(5, (0, common_1.Query)("order")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "getAllMember", null);
__decorate([
    (0, common_1.Get)("/admin"),
    (0, auth_decorator_1.Roles)("admin"),
    __param(0, (0, common_1.Query)("take")),
    __param(1, (0, common_1.Query)("skip")),
    __param(2, (0, common_1.Query)("search")),
    __param(3, (0, common_1.Query)("orderby")),
    __param(4, (0, common_1.Query)("order")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "getAllAdmin", null);
__decorate([
    (0, common_1.Get)("/count/members"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], UsersController.prototype, "countMembers", null);
__decorate([
    (0, common_1.Get)("/count/admin"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], UsersController.prototype, "countAdmin", null);
__decorate([
    (0, common_1.Get)("/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "getUser", null);
__decorate([
    (0, common_1.Get)("/email/:email"),
    __param(0, (0, common_1.Param)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Post)(""),
    (0, auth_decorator_1.Roles)("admin"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Put)("/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)("/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "deleteUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)("users"),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map