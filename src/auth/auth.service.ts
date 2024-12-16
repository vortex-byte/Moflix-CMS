import {
    Injectable,
    UnauthorizedException,
    NotFoundException,
    InternalServerErrorException,
    BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./register.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async login(email: string, password: string): Promise<object> {
        try {
            const user = await this.usersService.findByEmail(email);
            if (!user.data) throw new NotFoundException({ status: "error", message: "User not found." });

            const isMatch = await bcrypt.compare(password, user.data.password);
            if (!isMatch) throw new UnauthorizedException({ status: "error", message: "Password invalid." });

            delete user.data["password"];
            const payload = { ...user.data };
            const token = await this.jwtService.signAsync(payload, { secret: this.configService.get("JWT_SECRET") });
            return {
                status: "ok",
                message: "User logged in successfully.",
                token: token,
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
                throw error;
            } else {
                throw new InternalServerErrorException({ status: "error", message: error.message });
            }
        }
    }

    async register(registerDto: RegisterDto): Promise<any> {
        try {
            const user = await this.usersService.findByEmail(registerDto.email);
            if (user && user.data)
                throw new BadRequestException({ status: "error", message: "Email already in used." });

            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            registerDto.password = hashedPassword;

            const newUser = await this.usersService.createUser(registerDto);
            if (!newUser.data) throw new InternalServerErrorException(newUser);

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
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                throw new InternalServerErrorException({ status: "error", message: error });
            }
        }
    }
}
