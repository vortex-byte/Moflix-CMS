import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { PostEntity } from "../posts/posts.entity";

@Entity("genre")
export class GenreEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @ManyToMany(() => PostEntity, (post) => post.genres)
    posts: PostEntity[];
}
