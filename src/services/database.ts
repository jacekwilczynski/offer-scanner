import { DataSource } from 'typeorm';
import { env } from 'src/services/env';
import { Offer } from 'src/entity/Offer';

export const dataSource = new DataSource({
    type: 'postgres',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Offer],
    migrations: [],
    subscribers: [],
});
