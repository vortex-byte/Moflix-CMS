import { DataSource } from "typeorm";
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
interface QueryResult {
    status: "ok" | "error";
    data?: any;
    message: string;
}
export declare class PostsService {
    private dataSource;
    private postRepository;
    private playerRepository;
    private categoryRepository;
    private genreRepository;
    private directorRepository;
    private castRepository;
    private logger;
    constructor(dataSource: DataSource);
    private toSlug;
    getAll(take?: number, skip?: number, type?: postType, status?: postStatus, search?: string, created_at?: Date, orderby?: postOrder, order?: "ASC" | "DESC"): Promise<QueryResult>;
    countPosts(): Promise<QueryResult>;
    getPost(id: number): Promise<QueryResult>;
    findPostBySlug(slug: string): Promise<QueryResult>;
    createPost(data: CreatePostDto): Promise<QueryResult>;
    updatePost(id: number, data: CreatePostDto): Promise<QueryResult>;
    deletePost(id: number): Promise<QueryResult>;
}
export {};
