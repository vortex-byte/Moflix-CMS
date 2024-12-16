import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { PostEntity } from "../posts/posts.entity";

@Entity("category")
export class CategorieEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @ManyToMany(() => PostEntity, (post) => post.categories)
    posts: PostEntity[];
}