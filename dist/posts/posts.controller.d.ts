import { PostsService } from "./posts.service";
import { CreatePostDto } from "./create.dto";
declare enum postStatus {
    PUBLISH = "publish",
    DRAFT = "draft",
    REVISION = "revision"
}
declare enum postType {
    MOVIE = "movie",
    SERIES = "series",
    EPISODE = "episode"
}
declare enum postOrder {
    TITLE = "title",
    TYPE = "type",
    CREATED_AT = "created_at",
    STATUS = "status"
}
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    getAll(take: number, skip: number, type: postType, status: postStatus, search: string, created_at: Date, orderby: postOrder, order: "ASC" | "DESC"): object;
    countPosts(): object;
    getPost(id: number): object;
    findPostBySlug(slug: string): object;
    createPost(data: CreatePostDto): object;
    updatePost(id: number, data: CreatePostDto): object;
    deletePost(id: number): object;
}
export {};
