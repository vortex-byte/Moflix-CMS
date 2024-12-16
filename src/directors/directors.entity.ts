import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PostEntity } from "../posts/posts.entity";

@Entity("director")
export class DirectorEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @OneToMany(() => PostEntity, (post) => post.director)
    posts: PostEntity[];
}
