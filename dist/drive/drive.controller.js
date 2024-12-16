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
exports.DriveController = void 0;
const common_1 = require("@nestjs/common");
const admin_auth_guard_1 = require("../auth/admin-auth.guard");
const auth_decorator_1 = require("../auth/auth.decorator");
const drive_service_1 = require("./drive.service");
const add_dto_1 = require("./add.dto");
var driveStatus;
(function (driveStatus) {
    driveStatus["USED"] = "used";
    driveStatus["AVAILABLE"] = "available";
    driveStatus["REVOKED"] = "revoked";
})(driveStatus || (driveStatus = {}));
var driveOrder;
(function (driveOrder) {
    driveOrder["EMAIL"] = "email";
    driveOrder["USED"] = "used";
    driveOrder["CREATED_AT"] = "created_at";
    driveOrder["STATUS"] = "status";
})(driveOrder || (driveOrder = {}));
let DriveController = class DriveController {
    constructor(driveService) {
        this.driveService = driveService;
    }
    getAllAccount(take, skip, status, search, orderby, order) {
        return this.driveService.getAllAccount(take, skip, status, search, orderby, order);
    }
    countAccounts() {
        return this.driveService.countAccounts();
    }
    getAccount(id) {
        return this.driveService.getAccount(id);
    }
    addAccount(data) {
        return this.driveService.addAccount(data);
    }
    updateAccount(id, data) {
        return this.driveService.updateAccount(id, data);
    }
    deleteAccount(id) {
        return this.driveService.deleteAccount(id);
    }
};
exports.DriveController = DriveController;
__decorate([
    (0, common_1.Get)(""),
    __param(0, (0, common_1.Query)("take")),
    __param(1, (0, common_1.Query)("skip")),
    __param(2, (0, common_1.Query)("status")),
    __param(3, (0, common_1.Query)("search")),
    __param(4, (0, common_1.Query)("orderby")),
    __param(5, (0, common_1.Query)("order")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String]),
    __metadata("design:returntype", Object)
], DriveController.prototype, "getAllAccount", null);
__decorate([
    (0, common_1.Get)("/count"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], DriveController.prototype, "countAccounts", null);
__decorate([
    (0, common_1.Get)("/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], DriveController.prototype, "getAccount", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_dto_1.AddAccountDto]),
    __metadata("design:returntype", Object)
], DriveController.prototype, "addAccount", null);
__decorate([
    (0, common_1.Put)("/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Object)
], DriveController.prototype, "updateAccount", null);
__decorate([
    (0, common_1.Delete)("/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], DriveController.prototype, "deleteAccount", null);
exports.DriveController = DriveController = __decorate([
    (0, common_1.Controller)("drive"),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminGuard),
    (0, auth_decorator_1.Roles)("admin"),
    __metadata("design:paramtypes", [drive_service_1.DriveService])
], DriveController);
//# sourceMappingURL=drive.controller.js.map