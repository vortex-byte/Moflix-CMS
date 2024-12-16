import { PostEntity } from "../posts/posts.entity";
export declare class CategorieEntity {
    id: number;
    name: string;
    slug: string;
    posts: PostEntity[];
}
