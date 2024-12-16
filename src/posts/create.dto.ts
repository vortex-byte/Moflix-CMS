import { IsString, IsArray, IsInt, IsOptional, IsEnum, IsDate, IsNotEmpty } from "class-validator";

enum PostType {
    MOVIE = "movie",
    SERIES = "series",
    EPISODE = "episode",
}

enum AiringType {
    ONGOING = "ongoing",
    COMPLETED = "completed",
}

enum PostStatus {
    PUBLISH = "publish",
    DRAFT = "draft",
    REVISION = "revision",
}

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    player: string;

    @IsOptional()
    @IsString()
    slug: string;

    @IsNotEmpty()
    @IsEnum(PostType)
    type: string;

    @IsOptional()
    @IsEnum(AiringType)
    airing: string;

    @IsOptional()
    synopsis: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    categories: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    genres: string[];

    @IsOptional()
    @IsString()
    poster: string;

    @IsOptional()
    @IsInt()
    season: number;

    @IsOptional()
    @IsInt()
    episode: number;

    @IsOptional()
    @IsDate()
    released: Date;

    @IsOptional()
    @IsInt()
    score: number;

    @IsOptional()
    @IsInt()
    voters: number;

    @IsOptional()
    @IsString()
    country: number;

    @IsOptional()
    @IsString()
    director: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    casts: string[];

    @IsOptional()
    @IsString()
    trailer: string;

    @IsOptional()
    @IsEnum(PostStatus)
    status: string;
}
