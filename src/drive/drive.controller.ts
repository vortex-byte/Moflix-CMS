import { Controller, Get, Post, Body, Param, Query, Put, Delete, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../auth/admin-auth.guard";
import { Roles } from "../auth/auth.decorator";
import { DriveService } from "./drive.service";
import { AddAccountDto } from "./add.dto";

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

@Controller("drive")
@UseGuards(AdminGuard)
@Roles("admin")
export class DriveController {
    constructor(private readonly driveService: DriveService) {}

    @Get("")
    getAllAccount(
        @Query("take") take: number,
        @Query("skip") skip: number,
        @Query("status") status: driveStatus,
        @Query("search") search: string,
        @Query("orderby") orderby: driveOrder,
        @Query("order") order: "ASC" | "DESC"
    ): object {
        return this.driveService.getAllAccount(take, skip, status, search, orderby, order);
    }

    @Get("/count")
    countAccounts(): object {
        return this.driveService.countAccounts();
    }

    @Get("/:id")
    getAccount(@Param("id") id: number): object {
        return this.driveService.getAccount(id);
    }

    @Post("")
    addAccount(@Body() data: AddAccountDto): object {
        return this.driveService.addAccount(data);
    }

    @Put("/:id")
    updateAccount(@Param("id") id: number, @Body() data: any): object {
        return this.driveService.updateAccount(id, data);
    }

    @Delete("/:id")
    deleteAccount(@Param("id") id: number): object {
        return this.driveService.deleteAccount(id);
    }
}
