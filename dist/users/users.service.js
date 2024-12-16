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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const users_entity_1 = require("./users.entity");
const users_middleware_1 = require("./users.middleware");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MODERATOR"] = "moderator";
    UserRole["MEMBER"] = "member";
})(UserRole || (UserRole = {}));
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
let UsersService = class UsersService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger("UsersServices");
        this.userRepository = this.dataSource.getRepository(users_entity_1.UserEntity);
        this.currentUser = (0, users_middleware_1.getAsyncUser)();
    }
    async getAllMember(take = 10, skip = 0, status = null, search = null, orderby = UserOrder.CREATED_AT, order = "DESC") {
        try {
            const query = this.userRepository
                .createQueryBuilder("user")
                .select([
                "user.id",
                "user.name",
                "user.email",
                "user.role",
                "user.phone",
                "user.country",
                "user.status",
                "user.created_at",
            ])
                .where({
                role: UserRole.MEMBER,
            })
                .take(take);
            if (skip)
                query.skip(skip);
            if (status)
                query.andWhere("user.status = :status", { status });
            if (search)
                query.andWhere("user.name LIKE :search OR user.email LIKE :search", { search: `%${search}%` });
            const get = await query.orderBy(`user.${orderby}`, order).getMany();
            return {
                status: "ok",
                data: get,
                message: "Members retrieved successfully.",
            };
        }
        catch (error) {
            this.logger.error(`Failed to get members: ${error.message}`);
            throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
        }
    }
    async getAllAdmin(take = 10, skip = 0, search = null, orderby = UserOrder.CREATED_AT, order = "DESC") {
        try {
            const query = this.userRepository
                .createQueryBuilder("user")
                .select([
                "user.id",
                "user.name",
                "user.email",
                "user.role",
                "user.phone",
                "user.country",
                "user.status",
                "user.created_at",
            ])
                .where("role != :role", { role: UserRole.MEMBER })
                .take(take);
            if (skip)
                query.skip(skip);
            if (search)
                query.andWhere("user.name LIKE :search OR user.email LIKE :search", { search: `%${search}%` });
            const get = await query.orderBy(`user.${orderby}`, order).getMany();
            return {
                status: "ok",
                data: get,
                message: "Admin retrieved successfully.",
            };
        }
        catch (error) {
            this.logger.error(`Failed to get admins: ${error.message}`);
            throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
        }
    }
    async countMembers() {
        try {
            const total = await this.userRepository
                .createQueryBuilder("user")
                .where("user.role = :role", { role: UserRole.MEMBER })
                .getCount();
            const banned = await this.userRepository
                .createQueryBuilder("user")
                .where("user.role = :role", { role: UserRole.MEMBER })
                .andWhere("user.status = :status", { status: UserStatus.BANNED })
                .getCount();
            return { status: "ok", data: { total, banned }, message: "Members counted successfully." };
        }
        catch (error) {
            this.logger.error(`Failed to count members: ${error.message}`);
            throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
        }
    }
    async countAdmin() {
        try {
            const total = await this.userRepository
                .createQueryBuilder("user")
                .where("user.role != :role", { role: UserRole.MEMBER })
                .getCount();
            const admin = await this.userRepository
                .createQueryBuilder("user")
                .where("user.role = :role", { role: UserRole.ADMIN })
                .getCount();
            const moderator = await this.userRepository
                .createQueryBuilder("user")
                .where("user.role = :role", { role: UserRole.MODERATOR })
                .getCount();
            return { status: "ok", data: { total, admin, moderator }, message: "Admin counted successfully." };
        }
        catch (error) {
            this.logger.error(`Failed to count admins: ${error.message}`);
            throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
        }
    }
    async getUser(id) {
        try {
            id = Number(id);
            if (isNaN(id))
                throw new common_1.NotFoundException({ status: "error", message: "Invalid user id." });
            const find = await this.userRepository.findOne({
                where: { id },
                cache: true,
            });
            if (!find)
                throw new common_1.NotFoundException({ status: "error", message: "User not found." });
            return { status: "ok", data: find, message: "User retrieved successfully." };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            else {
                this.logger.error(`Failed to find user: ${error.message}`);
                throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }
    async findByEmail(email) {
        try {
            let find = await this.userRepository.findOne({
                where: { email: email },
                cache: true,
            });
            if (!find)
                return { status: "error", message: "Cannot find the user." };
            return { status: "ok", data: find, message: "User retrieved successfully." };
        }
        catch (error) {
            this.logger.error(`Failed to find user by email: ${error.message}`);
            throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
        }
    }
    async createUser(data) {
        try {
            const user = this.userRepository.create(data);
            await this.userRepository.save(user);
            return { status: "ok", data: user, message: "User created successfully." };
        }
        catch (error) {
            if (error.code == 23505)
                return { status: "error", message: "Email already in used." };
            this.logger.error(`Failed to create user: ${error.message}`);
            throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
        }
    }
    async updateUser(id, data) {
        try {
            id = Number(id);
            if (isNaN(id))
                throw new common_1.NotFoundException({ status: "error", message: "Invalid user id." });
            const user = await this.userRepository.findOne({ where: { id: id } });
            if (!user)
                throw new common_1.NotFoundException({ status: "error", message: "User not found." });
            if (user.id != this.currentUser.id &&
                user.role == UserRole.ADMIN &&
                this.currentUser.role != UserRole.ADMIN) {
                throw new common_1.UnauthorizedException({
                    status: "error",
                    message: "You are not authorized to update this user.",
                });
            }
            await this.userRepository.update({ id }, data);
            return { status: "ok", data: user, message: "User updated successfully." };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            else {
                this.logger.error(`Failed to update user: ${error.message}`);
                throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }
    async deleteUser(id) {
        try {
            id = Number(id);
            if (isNaN(id))
                throw new common_1.NotFoundException({ status: "error", message: "Invalid user id." });
            const user = await this.userRepository.findOne({ where: { id: id } });
            if (!user)
                throw new common_1.NotFoundException({ status: "error", message: "User not found." });
            if (user.id != this.currentUser.id &&
                user.role == UserRole.ADMIN &&
                this.currentUser.role != UserRole.ADMIN) {
                throw new common_1.UnauthorizedException({
                    status: "error",
                    message: "You are not authorized to update this user.",
                });
            }
            await this.userRepository.delete({ id: id });
            return { status: "ok", data: user, message: "User deleted successfully." };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            else {
                this.logger.error(`Failed to delete user: ${error.message}`);
                throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], UsersService);
//# sourceMappingURL=users.service.js.map