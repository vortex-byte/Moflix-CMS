"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const core_2 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const notfound_filter_1 = require("./notfound.filter");
async function bootstrap() {
    const logger = new common_1.Logger("App");
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    const reflector = app.get(core_2.Reflector);
    app.useGlobalFilters(new notfound_filter_1.NotFoundExceptionFilter());
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(reflector));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
            const result = errors.flatMap((error) => Object.values(error.constraints));
            return new common_1.BadRequestException({
                status: "error",
                message: "Validation failed",
                errors: result,
            });
        },
    }));
    const configService = app.get(config_1.ConfigService);
    const port = configService.get("port");
    await app.listen(port);
    logger.log(`Server running on port: ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map