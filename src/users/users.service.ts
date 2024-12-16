import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    UnauthorizedException,
    Logger,
} from "@nestjs/common";
import { DataSource } from "typeorm";
import { UserEntity } from "./users.entity";
import { getAsyncUser } from "./users.middleware";

enum UserRole {
    ADMIN = "admin",
    MODERATOR = "moderator",
    MEMBER = "member",
}

enum UserStatus {
    ACTIVE = "active",
    BANNED = "banned",
}

enum UserOrder {
    NAME = "name",
    EMAIL = "email",
    CREATED_AT = "created_at",
    STATUS = "status",
}

interface CreateUser {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    phone?: number | null;
    country?: string | null;
    status?: UserStatus;
}

interface UpdateUser {
    name?: string;
    role?: UserRole;
    status?: UserStatus;
}

interface QueryResult {
    status: "ok" | "error";
    data?: any;
    message: string;
}

@Injectable()
export class UsersService {
    private currentUser;
    private userRepository;
    private logger = new Logger("UsersServices");

    constructor(private dataSource: DataSource) {
        this.userRepository = this.dataSource.getRepository(UserEntity);
        this.currentUser = getAsyncUser();
    }

    async getAllMember(
        take: number = 10,
        skip: number = 0,
        status: UserStatus = null,
        search: string = null,
        orderby: UserOrder = UserOrder.CREATED_AT,
        order: "ASC" | "DESC" = "DESC"
    ): Promise<QueryResult> {
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

            if (skip) query.skip(skip);
            if (status) query.andWhere("user.status = :status", { status });
            if (search) query.andWhere("user.name LIKE :search OR user.email LIKE :search", { search: `%${search}%` });

            const get = await query.orderBy(`user.${orderby}`, order).getMany();
            return {
                status: "ok",
                data: get,
                message: "Members retrieved successfully.",
            };
        } catch (error) {
            this.logger.error(`Failed to get members: ${error.message}`);
            throw new InternalServerErrorException({ status: "error", message: error.message });
        }
    }

    async getAllAdmin(
        take: number = 10,
        skip: number = 0,
        search: string = null,
        orderby: UserOrder = UserOrder.CREATED_AT,
        order: "ASC" | "DESC" = "DESC"
    ): Promise<QueryResult> {
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

            if (skip) query.skip(skip);
            if (search) query.andWhere("user.name LIKE :search OR user.email LIKE :search", { search: `%${search}%` });

            const get = await query.orderBy(`user.${orderby}`, order).getMany();
            return {
                status: "ok",
                data: get,
                message: "Admin retrieved successfully.",
            };
        } catch (error) {
            this.logger.error(`Failed to get admins: ${error.message}`);
            throw new InternalServerErrorException({ status: "error", message: error.message });
        }
    }

    async countMembers(): Promise<QueryResult> {
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
        } catch (error) {
            this.logger.error(`Failed to count members: ${error.message}`);
            throw new InternalServerErrorException({ status: "error", message: error.message });
        }
    }

    async countAdmin(): Promise<QueryResult> {
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
        } catch (error) {
            this.logger.error(`Failed to count admins: ${error.message}`);
            throw new InternalServerErrorException({ status: "error", message: error.message });
        }
    }

    async getUser(id: number): Promise<QueryResult> {
        try {
            id = Number(id);
            if (isNaN(id)) throw new NotFoundException({ status: "error", message: "Invalid user id." });

            const find = await this.userRepository.findOne({
                where: { id },
                cache: true,
            });

            if (!find) throw new NotFoundException({ status: "error", message: "User not found." });

            return { status: "ok", data: find, message: "User retrieved successfully." };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                this.logger.error(`Failed to find user: ${error.message}`);
                throw new InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }

    async findByEmail(email: string): Promise<QueryResult> {
        try {
            let find = await this.userRepository.findOne({
                where: { email: email },
                cache: true,
            });

            if (!find) return { status: "error", message: "Cannot find the user." };

            return { status: "ok", data: find, message: "User retrieved successfully." };
        } catch (error) {
            this.logger.error(`Failed to find user by email: ${error.message}`);
            throw new InternalServerErrorException({ status: "error", message: error.message });
        }
    }

    async createUser(data: CreateUser): Promise<QueryResult> {
        try {
            const user = this.userRepository.create(data);
            await this.userRepository.save(user);
            return { status: "ok", data: user, message: "User created successfully." };
        } catch (error) {
            if (error.code == 23505) return { status: "error", message: "Email already in used." };
            this.logger.error(`Failed to create user: ${error.message}`);
            throw new InternalServerErrorException({ status: "error", message: error.message });
        }
    }

    async updateUser(id: number, data: UpdateUser): Promise<QueryResult> {
        try {
            id = Number(id);
            if (isNaN(id)) throw new NotFoundException({ status: "error", message: "Invalid user id." });

            const user = await this.userRepository.findOne({ where: { id: id } });
            if (!user) throw new NotFoundException({ status: "error", message: "User not found." });

            if (
                user.id != this.currentUser.id &&
                user.role == UserRole.ADMIN &&
                this.currentUser.role != UserRole.ADMIN
            ) {
                throw new UnauthorizedException({
                    status: "error",
                    message: "You are not authorized to update this user.",
                });
            }

            await this.userRepository.update({ id }, data);
            return { status: "ok", data: user, message: "User updated successfully." };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
                throw error;
            } else {
                this.logger.error(`Failed to update user: ${error.message}`);
                throw new InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }

    async deleteUser(id: number): Promise<QueryResult> {
        try {
            id = Number(id);
            if (isNaN(id)) throw new NotFoundException({ status: "error", message: "Invalid user id." });

            const user = await this.userRepository.findOne({ where: { id: id } });
            if (!user) throw new NotFoundException({ status: "error", message: "User not found." });

            if (
                user.id != this.currentUser.id &&
                user.role == UserRole.ADMIN &&
                this.currentUser.role != UserRole.ADMIN
            ) {
                throw new UnauthorizedException({
                    status: "error",
                    message: "You are not authorized to update this user.",
                });
            }

            await this.userRepository.delete({ id: id });
            return { status: "ok", data: user, message: "User deleted successfully." };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
                throw error;
            } else {
                this.logger.error(`Failed to delete user: ${error.message}`);
                throw new InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }
}
