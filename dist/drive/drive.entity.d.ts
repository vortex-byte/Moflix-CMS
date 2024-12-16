export declare enum AccountStatus {
    USED = "used",
    AVAILABLE = "available",
    REVOKED = "revoked"
}
export declare class DriveEntity {
    id: number;
    email: string;
    credentials: string;
    used: number;
    total: number;
    status: AccountStatus;
    created_at: Date;
    updated_at: Date;
}
