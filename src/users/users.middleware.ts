import { Injectable, NestMiddleware } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";

const asyncLocalStorage = new AsyncLocalStorage();

@Injectable()
export class UserMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        asyncLocalStorage.run(new Map(), () => {
            const store = asyncLocalStorage.getStore() as Map<string, any>;
            store.set("user", req.user);
            next();
        });
    }
}

export const getAsyncUser = () => {
    const store = asyncLocalStorage.getStore();
    return store ? (store as Map<string, any>).get("user") : null;
};
