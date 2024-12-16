import { Controller, Get, Post, Body, Param, Query, Put, Delete, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../auth/admin-auth.guard";
import { Roles } from "../auth/auth.decorator";
import { UsersService } from "./users.service";

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

@Controller("users")
@UseGuards(AdminGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get("/members")
    getAllMember(
        @Query("take") take: number,
        @Query("skip") skip: number,
        @Query("status") status: UserStatus,
        @Query("search") search: string,
        @Query("orderby") orderby: UserOrder,
        @Query("order") order: "ASC" | "DESC"
    ): object {
        return this.usersService.getAllMember(take, skip, status, search, orderby, order);
    }

    @Get("/admin")
    @Roles("admin")
    getAllAdmin(
        @Query("take") take: number,
        @Query("skip") skip: number,
        @Query("search") search: string,
        @Query("orderby") orderby: UserOrder,
        @Query("order") order: "ASC" | "DESC"
    ): object {
        return this.usersService.getAllAdmin(take, skip, search, orderby, order);
    }

    @Get("/count/members")
    countMembers(): object {
        return this.usersService.countMembers();
    }

    @Get("/count/admin")
    countAdmin(): object {
        return this.usersService.countAdmin();
    }

    @Get("/:id")
    getUser(@Param("id") id: number): object {
        return this.usersService.getUser(id);
    }

    @Get("/email/:email")
    findByEmail(@Param("email") email: string): object {
        return this.usersService.findByEmail(email);
    }

    @Post("")
    @Roles("admin")
    createUser(@Body() data: any): object {
        return this.usersService.createUser(data);
    }

    @Put("/:id")
    updateUser(@Param("id") id: number, @Body() data: any): object {
        return this.usersService.updateUser(id, data);
    }

    @Delete("/:id")
    deleteUser(@Param("id") id: number): object {
        return this.usersService.deleteUser(id);
    }
}
