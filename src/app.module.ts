import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { config } from "./config/config";
import { DatabaseModule } from "./database/database.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { DriveModule } from "./drive/drive.module";
import { PostsModule } from "./posts/posts.module";
import { GenresModule } from './genres/genres.module';
import { CategoriesModule } from './categories/categories.module';
import { DirectorsModule } from './directors/directors.module';
import { CastsModule } from './casts/casts.module';
import { PlayersModule } from './players/players.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
        }),
        DatabaseModule,
        UsersModule,
        AuthModule,
        DriveModule,
        PostsModule,
        GenresModule,
        CategoriesModule,
        DirectorsModule,
        CastsModule,
        PlayersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
