import { Controller, Get, Post, Body, Param, Query, Put, Delete, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../auth/admin-auth.guard";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./create.dto";

enum postStatus {
    PUBLISH = "publish",
    DRAFT = "draft",
    REVISION = "revision",
}

enum postType {
    MOVIE = "movie",
    SERIES = "series",
    EPISODE = "episode",
}

enum postOrder {
    TITLE = "title",
    TYPE = "type",
    CREATED_AT = "created_at",
    STATUS = "status",
}

@Controller("posts")
@UseGuards(AdminGuard)
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get("")
    getAll(
        @Query("take") take: number,
        @Query("skip") skip: number,
        @Query("type") type: postType,
        @Query("status") status: postStatus,
        @Query("search") search: string,
        @Query("created_at") created_at: Date,
        @Query("orderby") orderby: postOrder,
        @Query("order") order: "ASC" | "DESC"
    ): object {
        return this.postsService.getAll(take, skip, type, status, search, created_at, orderby, order);
    }

    @Get("/count")
    countPosts(): object {
        return this.postsService.countPosts();
    }

    @Get("/:id")
    getPost(@Param("id") id: number): object {
        return this.postsService.getPost(id);
    }

    @Get("slug/:slug")
    findPostBySlug(@Param("slug") slug: string): object {
        return this.postsService.findPostBySlug(slug);
    }

    @Post("")
    createPost(@Body() data: CreatePostDto): object {
        return this.postsService.createPost(data);
    }

    @Put("/:id")
    updatePost(@Param("id") id: number, @Body() data: CreatePostDto): object {
        return this.postsService.updatePost(id, data);
    }

    @Delete("/:id")
    deletePost(@Param("id") id: number): object {
        return this.postsService.deletePost(id);
    }
}
