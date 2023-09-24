import path from 'path';
import { env } from 'src/init/env';
import { Config } from 'drizzle-kit';

export const migrationsFolder = path.resolve(env.PROJECT_DIR, 'migrations');

export default {
    schema: path.resolve(env.PROJECT_DIR, 'src/schema/*'),
    // migrations not needed before first deployment
    // out: migrationsFolder,
    driver: 'pg',
    dbCredentials: { connectionString: env.DATABASE_URL },
} satisfies Config;
