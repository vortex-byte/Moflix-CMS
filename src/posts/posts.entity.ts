import {
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Entity,
    OneToOne,
    ManyToOne,
    ManyToMany,
    JoinColumn,
    JoinTable,
    PrimaryGeneratedColumn,
} from "typeorm";

import { PlayerEntity } from "../players/players.entity";
import { GenreEntity } from "../genres/genres.entity";
import { CategorieEntity } from "../categories/categories.entity";
import { DirectorEntity } from "../directors/directors.entity";
import { CastEntity } from "../casts/casts.entity";

enum PostStatus {
    PUBLISH = "publish",
    DRAFT = "draft",
    REVISION = "revision",
}

enum PostType {
    MOVIE = "movie",
    SERIES = "series",
    EPISODE = "episode",
}

enum AiringType {
    ONGOING = "ongoing",
    COMPLETED = "completed",
}

@Entity("post")
export class PostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => PlayerEntity, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        cascade: true,
        eager: true,
    })
    @JoinColumn()
    player: PlayerEntity;

    @Column()
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column({
        type: "enum",
        enum: PostType,
    })
    type: PostType;

    @Column({
        type: "enum",
        enum: AiringType,
        default: null,
        nullable: true,
    })
    airing: AiringType;

    @Column({ type: "text", nullable: true })
    synopsis: string;

    @ManyToMany(() => CategorieEntity, (category) => category.posts, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        cascade: true,
        eager: true,
        nullable: true,
    })
    @JoinTable({
        name: "post_categories",
        joinColumn: { name: "post_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "category_id", referencedColumnName: "id" },
    })
    categories?: CategorieEntity[];

    @ManyToMany(() => GenreEntity, (genre) => genre.posts, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        cascade: true,
        eager: true,
        nullable: true,
    })
    @JoinTable({
        name: "post_genres",
        joinColumn: { name: "post_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "genre_id", referencedColumnName: "id" },
    })
    genres?: GenreEntity[];

    @Column({ length: 255, nullable: true })
    poster: string;

    @Column({ nullable: true })
    season: number;

    @Column({ nullable: true })
    episode: number;

    @Column({ nullable: true })
    released: number;

    @Column({ nullable: true })
    score: number;

    @Column({ nullable: true })
    voters: number;

    @Column({ nullable: true })
    country: number;

    @ManyToOne(() => DirectorEntity, (director) => director.posts, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        cascade: true,
        eager: true,
        nullable: true,
    })
    director: DirectorEntity;

    @ManyToMany(() => CastEntity, (cast) => cast.posts, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        cascade: true,
        eager: true,
        nullable: true,
    })
    @JoinTable({
        name: "post_casts",
        joinColumn: { name: "post_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "cast_id", referencedColumnName: "id" },
    })
    casts?: CastEntity[];

    @Column({ length: 255, nullable: true })
    trailer: string;

    @Column({
        type: "enum",
        enum: PostStatus,
        default: PostStatus.DRAFT,
    })
    status: PostStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
