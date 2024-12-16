import { DataSource } from "typeorm";
declare enum UserRole {
    ADMIN = "admin",
    MODERATOR = "moderator",
    MEMBER = "member"
}
declare enum UserStatus {
    ACTIVE = "active",
    BANNED = "banned"
}
declare enum UserOrder {
    NAME = "name",
    EMAIL = "email",
    CREATED_AT = "created_at",
    STATUS = "status"
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
export declare class UsersService {
    private dataSource;
    private currentUser;
    private userRepository;
    private logger;
    constructor(dataSource: DataSource);
    getAllMember(take?: number, skip?: number, status?: UserStatus, search?: string, orderby?: UserOrder, order?: "ASC" | "DESC"): Promise<QueryResult>;
    getAllAdmin(take?: number, skip?: number, search?: string, orderby?: UserOrder, order?: "ASC" | "DESC"): Promise<QueryResult>;
    countMembers(): Promise<QueryResult>;
    countAdmin(): Promise<QueryResult>;
    getUser(id: number): Promise<QueryResult>;
    findByEmail(email: string): Promise<QueryResult>;
    createUser(data: CreateUser): Promise<QueryResult>;
    updateUser(id: number, data: UpdateUser): Promise<QueryResult>;
    deleteUser(id: number): Promise<QueryResult>;
}
export {};
