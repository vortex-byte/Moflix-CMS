import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe, BadRequestException, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { NotFoundExceptionFilter } from "./notfound.filter";

async function bootstrap() {
    const logger = new Logger("App");
    const app = await NestFactory.create(AppModule, { cors: true });
    const reflector = app.get(Reflector);

    app.useGlobalFilters(new NotFoundExceptionFilter());
    app.useGlobalGuards(new JwtAuthGuard(reflector));
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Menghapus properti yang tidak didefinisikan di DTO
            forbidNonWhitelisted: true, // Menolak permintaan dengan properti yang tidak valid
            transform: true, // Mengubah input menjadi tipe yang sesuai di DTO
            exceptionFactory: (errors) => {
                const result = errors.flatMap((error) => Object.values(error.constraints));
                return new BadRequestException({
                    status: "error",
                    message: "Validation failed",
                    errors: result,
                });
            },
        })
    );

    const configService = app.get(ConfigService);
    const port = configService.get<number>("port");
    await app.listen(port);
    logger.log(`Server running on port: ${port}`);
}
bootstrap();
