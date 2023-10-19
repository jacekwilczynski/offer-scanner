import { runWithServices } from 'src/dependency-injection';
import { env } from 'src/dependency-injection/env';

runWithServices(['refresh', 'server'], async ({ refresh, server }) => {
    await server.listen();
    console.log(`Listening on port ${env.HTTP_PORT}.`);

    refresh.execute();
    setInterval(() => refresh.execute().catch(console.error), 60_000);
});
