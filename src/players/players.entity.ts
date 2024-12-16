import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

enum PlayerStatus {
    PUBLISH = "publish",
    DRAFT = "draft",
    REVISION = "revision",
}

interface Player {
    url: string;
    subtitle: string;
}

@Entity("player")
export class PlayerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    title: string;

    @Column({ unique: true })
    code: string;

    @Column("jsonb")
    players: Player[];

    @Column({
        type: "enum",
        enum: PlayerStatus,
        default: PlayerStatus.DRAFT,
    })
    status: PlayerStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
