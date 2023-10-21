import { runWithServices } from 'src/dependency-injection';
import { env } from 'src/dependency-injection/env';

runWithServices(['server'], async ({ server }) => {
    await server.listen(env.HTTP_PORT);
    console.log(`Listening on port ${env.HTTP_PORT}.`);
});
