import { AuthService } from "./auth.service";
import { RegisterDto } from "./register.dto";
import { LoginDto } from "./login.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<object>;
    register(registerDto: RegisterDto): Promise<any>;
}
