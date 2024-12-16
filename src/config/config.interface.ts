interface DatabaseConfigProps {
    name: string;
    username: string;
    password: string;
}

export interface ConfigProps {
    port: number;
    database: DatabaseConfigProps;
}
