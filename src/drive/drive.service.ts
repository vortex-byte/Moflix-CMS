import { Injectable, NotFoundException, InternalServerErrorException, Logger } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DriveEntity } from "./drive.entity";
import { AddAccountDto } from "./add.dto";

interface QueryResult {
    status: "ok" | "error";
    data?: any;
    message: string;
}

interface updateAccount {
    status: driveStatus;
    credentials?: string;
}

enum driveStatus {
    USED = "used",
    AVAILABLE = "available",
    REVOKED = "revoked",
}

enum driveOrder {
    EMAIL = "email",
    USED = "used",
    CREATED_AT = "created_at",
    STATUS = "status",
}

@Injectable()
export class DriveService {
    private driveRepository;
    private logger = new Logger("DriveService");

    constructor(private dataSource: DataSource) {
        this.driveRepository = this.dataSource.getRepository(DriveEntity);
    }

    async getAllAccount(
        take: number = 10,
        skip: number = 0,
        status: driveStatus = null,
        search: string = null,
        orderby: driveOrder = driveOrder.CREATED_AT,
        order: "ASC" | "DESC" = "DESC"
    ): Promise<QueryResult> {
        try {
            const query = this.driveRepository.createQueryBuilder("drive").take(take);
            if (skip) query.skip(skip);
            if (status) query.where("drive.status = :status", { status });
            if (search) query.andWhere("drive.email ILIKE :search", { search: `%${search}%` });

            const get = await query.orderBy(`drive.${orderby}`, order).getMany();
            return {
                status: "ok",
                data: get,
                message: "Drive accounts retrieved successfully.",
            };
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException({ status: "error", message: error.message });
        }
    }

    async countAccounts(): Promise<QueryResult> {
        try {
            const total = await this.driveRepository.createQueryBuilder("drive").getCount();
            return { status: "ok", data: { total }, message: "Drive accounts counted successfully." };
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException({ status: "error", message: error.message });
        }
    }

    async getAccount(id: number): Promise<QueryResult> {
        try {
            id = Number(id);
            if (isNaN(id)) throw new NotFoundException({ status: "error", message: "Invalid drive account id." });

            const find = await this.driveRepository.findOne({
                where: { id: Number(id) },
                cache: true,
            });

            if (!find) throw new NotFoundException({ status: "error", message: "Account not found." });

            return { status: "ok", data: find, message: "Account retrieved successfully." };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                this.logger.error(error.message);
                throw new InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }

    async addAccount(data: AddAccountDto): Promise<QueryResult> {
        try {
            const account = this.driveRepository.create(data);
            await this.driveRepository.save(account);
            return { status: "ok", data: account, message: "Drive account added successfully." };
        } catch (error) {
            if (error.code == 23505) return { status: "error", message: "Account already added." };
            this.logger.error(error.message);
            throw new InternalServerErrorException({ status: "error", message: error.message });
        }
    }

    async updateAccount(id: number, data: updateAccount): Promise<QueryResult> {
        try {
            id = Number(id);
            if (isNaN(id)) throw new NotFoundException({ status: "error", message: "Invalid drive account id." });

            const account = await this.driveRepository.findOne({ where: { id: id } });
            if (!account) throw new NotFoundException({ status: "error", message: "Drive account not found." });

            await this.driveRepository.update({ id: id }, data);
            return { status: "ok", data: account, message: "Drive account updated successfully." };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                this.logger.error(error.message);
                throw new InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }

    async deleteAccount(id: number): Promise<QueryResult> {
        try {
            id = Number(id);
            if (isNaN(id)) throw new NotFoundException({ status: "error", message: "Invalid drive account id." });

            const account = await this.driveRepository.findOne({ where: { id: id } });
            if (!account) throw new NotFoundException({ status: "error", message: "Drive account not found." });

            await this.driveRepository.delete({ id: id });
            return { status: "ok", data: account, message: "Drive account deleted successfully." };
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
