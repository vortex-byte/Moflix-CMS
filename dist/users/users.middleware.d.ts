import { NestMiddleware } from "@nestjs/common";
export declare class UserMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): void;
}
export declare const getAsyncUser: () => any;
