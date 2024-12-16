declare enum PlayerStatus {
    PUBLISH = "publish",
    DRAFT = "draft",
    REVISION = "revision"
}
interface Player {
    url: string;
    subtitle: string;
}
export declare class PlayerEntity {
    id: number;
    title: string;
    code: string;
    players: Player[];
    status: PlayerStatus;
    created_at: Date;
    updated_at: Date;
}
export {};
