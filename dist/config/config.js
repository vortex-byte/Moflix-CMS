"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const config = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        name: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
    },
});
exports.config = config;
//# sourceMappingURL=config.js.map