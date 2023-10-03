import { z } from 'zod';

const baseSchema = z.object({
    DATABASE_URL: z.string().url(),
    HTTP_CLIENT_CACHE: z.string().optional().transform(v => v === '1'),
    PROJECT_DIR: z.string(),
    REDIS_URL: z.string().url(),
});

const smsConfigSchema = z.object({
    SINCH_URL: z.string().url(),
    SINCH_JWT: z.string(),
    SMS_FROM: z.string(),
    SMS_TO: z.string(),
}).partial();

const envSchema = baseSchema.merge(smsConfigSchema);

export const env = envSchema.parse(process.env);
