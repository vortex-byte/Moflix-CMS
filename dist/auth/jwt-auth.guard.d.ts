import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | any;
    handleRequest(err: any, user: any, info: any): any;
}
export {};
