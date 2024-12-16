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
exports.DriveService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const drive_entity_1 = require("./drive.entity");
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
let DriveService = class DriveService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger("DriveService");
        this.driveRepository = this.dataSource.getRepository(drive_entity_1.DriveEntity);
    }
    async getAllAccount(take = 10, skip = 0, status = null, search = null, orderby = driveOrder.CREATED_AT, order = "DESC") {
        try {
            const query = this.driveRepository.createQueryBuilder("drive").take(take);
            if (skip)
                query.skip(skip);
            if (status)
                query.where("drive.status = :status", { status });
            if (search)
                query.andWhere("drive.email ILIKE :search", { search: `%${search}%` });
            const get = await query.orderBy(`drive.${orderby}`, order).getMany();
            return {
                status: "ok",
                data: get,
                message: "Drive accounts retrieved successfully.",
            };
        }
        catch (error) {
            this.logger.error(error.message);
            throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
        }
    }
    async countAccounts() {
        try {
            const total = await this.driveRepository.createQueryBuilder("drive").getCount();
            return { status: "ok", data: { total }, message: "Drive accounts counted successfully." };
        }
        catch (error) {
            this.logger.error(error.message);
            throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
        }
    }
    async getAccount(id) {
        try {
            id = Number(id);
            if (isNaN(id))
                throw new common_1.NotFoundException({ status: "error", message: "Invalid drive account id." });
            const find = await this.driveRepository.findOne({
                where: { id: Number(id) },
                cache: true,
            });
            if (!find)
                throw new common_1.NotFoundException({ status: "error", message: "Account not found." });
            return { status: "ok", data: find, message: "Account retrieved successfully." };
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
    async addAccount(data) {
        try {
            const account = this.driveRepository.create(data);
            await this.driveRepository.save(account);
            return { status: "ok", data: account, message: "Drive account added successfully." };
        }
        catch (error) {
            if (error.code == 23505)
                return { status: "error", message: "Account already added." };
            this.logger.error(error.message);
            throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
        }
    }
    async updateAccount(id, data) {
        try {
            id = Number(id);
            if (isNaN(id))
                throw new common_1.NotFoundException({ status: "error", message: "Invalid drive account id." });
            const account = await this.driveRepository.findOne({ where: { id: id } });
            if (!account)
                throw new common_1.NotFoundException({ status: "error", message: "Drive account not found." });
            await this.driveRepository.update({ id: id }, data);
            return { status: "ok", data: account, message: "Drive account updated successfully." };
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
    async deleteAccount(id) {
        try {
            id = Number(id);
            if (isNaN(id))
                throw new common_1.NotFoundException({ status: "error", message: "Invalid drive account id." });
            const account = await this.driveRepository.findOne({ where: { id: id } });
            if (!account)
                throw new common_1.NotFoundException({ status: "error", message: "Drive account not found." });
            await this.driveRepository.delete({ id: id });
            return { status: "ok", data: account, message: "Drive account deleted successfully." };
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
exports.DriveService = DriveService;
exports.DriveService = DriveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DriveService);
//# sourceMappingURL=drive.service.js.map