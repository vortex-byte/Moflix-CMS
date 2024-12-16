import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { join } from "path";

const logger = new Logger("Database");

export const databaseProviders = [
    {
        provide: DataSource,
        useFactory: async (configService: ConfigService) => {
            try {
                const dataSource = new DataSource({
                    type: "postgres",
                    host: "localhost",
                    port: 5432,
                    username: configService.get("DB_USER"),
                    password: configService.get("DB_PASS"),
                    database: configService.get("DB_NAME"),
                    entities: [join(__dirname, "..", "**", "*.entity.{ts,js}")],
                    synchronize: true,
                });

                await dataSource.initialize();
                logger.log("Database connection established");
                return dataSource;
            } catch (error) {
                logger.error("Database connection failed");
                throw error;
            }
        },
        inject: [ConfigService],
    },
];
