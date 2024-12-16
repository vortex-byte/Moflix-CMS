import { PostEntity } from "../posts/posts.entity";
export declare class CastEntity {
    id: number;
    name: string;
    slug: string;
    posts: PostEntity[];
}
