import { DriveService } from "./drive.service";
import { AddAccountDto } from "./add.dto";
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
export declare class DriveController {
    private readonly driveService;
    constructor(driveService: DriveService);
    getAllAccount(take: number, skip: number, status: driveStatus, search: string, orderby: driveOrder, order: "ASC" | "DESC"): object;
    countAccounts(): object;
    getAccount(id: number): object;
    addAccount(data: AddAccountDto): object;
    updateAccount(id: number, data: any): object;
    deleteAccount(id: number): object;
}
export {};
