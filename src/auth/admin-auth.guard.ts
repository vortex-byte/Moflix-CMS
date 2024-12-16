import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        let roles = this.reflector.get<string[]>("roles", context.getHandler());
        if (!roles) roles = this.reflector.get<string[]>("roles", context.getClass());
        if (!roles) roles = ["admin", "moderator"];

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException({ status: "error", message: "User not authenticated" });
        }

        const hasRole = roles.some((role) => user.role === role);
        if (!hasRole) {
            throw new ForbiddenException({
                status: "error",
                message: "You do not have permission to access this resource",
            });
        }

        return hasRole;
    }
}
