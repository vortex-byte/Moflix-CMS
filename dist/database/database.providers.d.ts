import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
export declare const databaseProviders: {
    provide: typeof DataSource;
    useFactory: (configService: ConfigService) => Promise<DataSource>;
    inject: (typeof ConfigService)[];
}[];
