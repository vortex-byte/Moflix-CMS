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
exports.DriveEntity = exports.AccountStatus = void 0;
const typeorm_1 = require("typeorm");
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["USED"] = "used";
    AccountStatus["AVAILABLE"] = "available";
    AccountStatus["REVOKED"] = "revoked";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
let DriveEntity = class DriveEntity {
};
exports.DriveEntity = DriveEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DriveEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], DriveEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { nullable: false }),
    __metadata("design:type", String)
], DriveEntity.prototype, "credentials", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], DriveEntity.prototype, "used", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], DriveEntity.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: AccountStatus,
        default: AccountStatus.AVAILABLE,
    }),
    __metadata("design:type", String)
], DriveEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DriveEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DriveEntity.prototype, "updated_at", void 0);
exports.DriveEntity = DriveEntity = __decorate([
    (0, typeorm_1.Entity)("drive")
], DriveEntity);
//# sourceMappingURL=drive.entity.js.map