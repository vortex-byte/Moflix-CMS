"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async login(email, password) {
        try {
            const user = await this.usersService.findByEmail(email);
            if (!user.data)
                throw new common_1.NotFoundException({ status: "error", message: "User not found." });
            const isMatch = await bcrypt.compare(password, user.data.password);
            if (!isMatch)
                throw new common_1.UnauthorizedException({ status: "error", message: "Password invalid." });
            delete user.data["password"];
            const payload = { ...user.data };
            const token = await this.jwtService.signAsync(payload, { secret: this.configService.get("JWT_SECRET") });
            return {
                status: "ok",
                message: "User logged in successfully.",
                token: token,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            else {
                throw new common_1.InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }
    async register(registerDto) {
        try {
            const user = await this.usersService.findByEmail(registerDto.email);
            if (user && user.data)
                throw new common_1.BadRequestException({ status: "error", message: "Email already in used." });
            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            registerDto.password = hashedPassword;
            const newUser = await this.usersService.createUser(registerDto);
            if (!newUser.data)
                throw new common_1.InternalServerErrorException(newUser);
            delete newUser.data["password"];
            const payload = { ...newUser.data };
            const token = await this.jwtService.signAsync(payload, {
                secret: this.configService.get("JWT_SECRET"),
            });
            return {
                status: "ok",
                message: "User registered successfully.",
                token: token,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            else {
                throw new common_1.InternalServerErrorException({ status: "error", message: error });
            }
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map