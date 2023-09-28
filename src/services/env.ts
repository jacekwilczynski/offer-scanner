import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    HTTP_CLIENT_CACHE: z.string().optional().transform(v => v === '1'),
    PROJECT_DIR: z.string(),
    REDIS_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
