import { UsersService } from "./users.service";
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
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllMember(take: number, skip: number, status: UserStatus, search: string, orderby: UserOrder, order: "ASC" | "DESC"): object;
    getAllAdmin(take: number, skip: number, search: string, orderby: UserOrder, order: "ASC" | "DESC"): object;
    countMembers(): object;
    countAdmin(): object;
    getUser(id: number): object;
    findByEmail(email: string): object;
    createUser(data: any): object;
    updateUser(id: number, data: any): object;
    deleteUser(id: number): object;
}
export {};
