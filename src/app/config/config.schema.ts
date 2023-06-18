import convict from 'convict';

export type ConfigSchema = {
    PORT: number;
    SALT: string;
    DB_HOST: string;
};

export const ConfigSchemaEnv = convict({
    PORT: {
        doc: 'port to bind',
        env: 'PORT',
        format: 'port',
        default: 3232,
    },
    SALT: {
        doc: 'Salt for password hash',
        format: String,
        env: 'SALT',
        default: 'secret',
    },
    DB_HOST: {
        doc: 'IP address of the database server (MongoDB)',
        format: 'ipaddress',
        env: 'DB_HOST',
        default: '127.0.0.1',
    },
});
