import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum AccountStatus {
    USED = "used",
    AVAILABLE = "available",
    REVOKED = "revoked",
}

@Entity("drive")
export class DriveEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column("jsonb", { nullable: false })
    credentials: string;

    @Column({ nullable: false })
    used: number;

    @Column({ nullable: false })
    total: number;

    @Column({
        type: "enum",
        enum: AccountStatus,
        default: AccountStatus.AVAILABLE,
    })
    status: AccountStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
