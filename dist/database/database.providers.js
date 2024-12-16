"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const logger = new common_1.Logger("Database");
exports.databaseProviders = [
    {
        provide: typeorm_1.DataSource,
        useFactory: async (configService) => {
            try {
                const dataSource = new typeorm_1.DataSource({
                    type: "postgres",
                    host: "localhost",
                    port: 5432,
                    username: configService.get("DB_USER"),
                    password: configService.get("DB_PASS"),
                    database: configService.get("DB_NAME"),
                    entities: [(0, path_1.join)(__dirname, "..", "**", "*.entity.{ts,js}")],
                    synchronize: true,
                });
                await dataSource.initialize();
                logger.log("Database connection established");
                return dataSource;
            }
            catch (error) {
                logger.error("Database connection failed");
                throw error;
            }
        },
        inject: [config_1.ConfigService],
    },
];
//# sourceMappingURL=database.providers.js.map