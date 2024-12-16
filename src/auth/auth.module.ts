import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { UsersModule } from "../users/users.module";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

const configService = new ConfigService();

@Module({
    imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.register({
            global: true,
            secret: configService.get("JWT_SECRET"),
            secretOrPrivateKey: configService.get("JWT_SECRET"),
            signOptions: { expiresIn: "1d" },
        }),
    ],
    providers: [AuthService, UsersService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
