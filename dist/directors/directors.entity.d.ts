import { PostEntity } from "../posts/posts.entity";
export declare class DirectorEntity {
    id: number;
    name: string;
    slug: string;
    posts: PostEntity[];
}
