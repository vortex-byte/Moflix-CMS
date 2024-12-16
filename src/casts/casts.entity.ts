import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { PostEntity } from "../posts/posts.entity";

@Entity("cast")
export class CastEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @ManyToMany(() => PostEntity, (post) => post.casts)
    posts: PostEntity[];
}
