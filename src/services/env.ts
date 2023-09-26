import { z } from 'zod';

const envSchema = z.object({
    DB_HOST: z.string().nonempty(),
    DB_PORT: z.string().nonempty().transform(Number),
    DB_USER: z.string().nonempty(),
    DB_PASS: z.string().nonempty(),
    DB_NAME: z.string().nonempty(),
    HTTP_CLIENT_CACHE: z.string().optional().transform(v => v === '1'),
    PROJECT_DIR: z.string().nonempty(),
    REDIS_URL: z.string().nonempty().url(),
});

export const env = envSchema.parse(process.env);
