import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    HTTP_CLIENT_CACHE: z.string().optional().transform(v => v === '1'),
    PROJECT_DIR: z.string(),
    REDIS_URL: z.string().url().optional(),
    SINCH_URL: z.string().optional(),
    SINCH_JWT: z.string().optional(),
    SMS_FROM: z.string().optional(),
    SMS_TO: z.string().optional(),
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
