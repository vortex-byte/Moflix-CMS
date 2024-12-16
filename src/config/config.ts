import { ConfigProps } from "./config.interface";

export const config = (): ConfigProps => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        name: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
    },
});
