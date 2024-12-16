import { DataSource } from "typeorm";
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
declare enum driveStatus {
    USED = "used",
    AVAILABLE = "available",
    REVOKED = "revoked"
}
declare enum driveOrder {
    EMAIL = "email",
    USED = "used",
    CREATED_AT = "created_at",
    STATUS = "status"
}
export declare class DriveService {
    private dataSource;
    private driveRepository;
    private logger;
    constructor(dataSource: DataSource);
    getAllAccount(take?: number, skip?: number, status?: driveStatus, search?: string, orderby?: driveOrder, order?: "ASC" | "DESC"): Promise<QueryResult>;
    countAccounts(): Promise<QueryResult>;
    getAccount(id: number): Promise<QueryResult>;
    addAccount(data: AddAccountDto): Promise<QueryResult>;
    updateAccount(id: number, data: updateAccount): Promise<QueryResult>;
    deleteAccount(id: number): Promise<QueryResult>;
}
export {};
