"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAsyncUser = exports.UserMiddleware = void 0;
const common_1 = require("@nestjs/common");
const async_hooks_1 = require("async_hooks");
const asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
let UserMiddleware = class UserMiddleware {
    use(req, res, next) {
        asyncLocalStorage.run(new Map(), () => {
            const store = asyncLocalStorage.getStore();
            store.set("user", req.user);
            next();
        });
    }
};
exports.UserMiddleware = UserMiddleware;
exports.UserMiddleware = UserMiddleware = __decorate([
    (0, common_1.Injectable)()
], UserMiddleware);
const getAsyncUser = () => {
    const store = asyncLocalStorage.getStore();
    return store ? store.get("user") : null;
};
exports.getAsyncUser = getAsyncUser;
//# sourceMappingURL=users.middleware.js.map