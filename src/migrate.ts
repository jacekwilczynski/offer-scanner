import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { env } from 'src/init/env';
import { migrationsFolder } from 'drizzle.config';

(async function () {
    const pg = postgres(env.DATABASE_URL, {
        max: 1,
        onnotice: (notice) => {
            if (process.argv.includes('-v')) {
                console.log(notice);
            }
        },
    });

    await migrate(drizzle(pg), { migrationsFolder });

    console.info('Migrations complete.');
    process.exit();
})();
