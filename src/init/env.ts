import { z } from 'zod';

const envSchema = z.object({
    HTTP_CLIENT_CACHE: z.string().optional().transform(v => v === '1'),
    REDIS_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
