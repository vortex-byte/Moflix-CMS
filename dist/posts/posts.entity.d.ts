import { PlayerEntity } from "../players/players.entity";
import { GenreEntity } from "../genres/genres.entity";
import { CategorieEntity } from "../categories/categories.entity";
import { DirectorEntity } from "../directors/directors.entity";
import { CastEntity } from "../casts/casts.entity";
declare enum PostStatus {
    PUBLISH = "publish",
    DRAFT = "draft",
    REVISION = "revision"
}
declare enum PostType {
    MOVIE = "movie",
    SERIES = "series",
    EPISODE = "episode"
}
declare enum AiringType {
    ONGOING = "ongoing",
    COMPLETED = "completed"
}
export declare class PostEntity {
    id: number;
    player: PlayerEntity;
    title: string;
    slug: string;
    type: PostType;
    airing: AiringType;
    synopsis: string;
    categories?: CategorieEntity[];
    genres?: GenreEntity[];
    poster: string;
    season: number;
    episode: number;
    released: number;
    score: number;
    voters: number;
    country: number;
    director: DirectorEntity;
    casts?: CastEntity[];
    trailer: string;
    status: PostStatus;
    created_at: Date;
    updated_at: Date;
}
export {};
