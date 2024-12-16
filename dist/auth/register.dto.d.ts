declare enum UserStatus {
    ACTIVE = "active"
}
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    phone: number;
    country: string;
    status: UserStatus;
}
export {};
