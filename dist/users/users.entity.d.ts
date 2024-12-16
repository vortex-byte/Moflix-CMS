export declare enum UserRole {
    ADMIN = "admin",
    MODERATOR = "moderator",
    MEMBER = "member"
}
export declare enum UserStatus {
    ACTIVE = "active",
    BANNED = "banned"
}
export declare class UserEntity {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone: number;
    country: string;
    status: UserStatus;
    created_at: Date;
    updated_at: Date;
}
