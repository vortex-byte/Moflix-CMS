import { PostEntity } from "../posts/posts.entity";
export declare class GenreEntity {
    id: number;
    name: string;
    slug: string;
    posts: PostEntity[];
}
