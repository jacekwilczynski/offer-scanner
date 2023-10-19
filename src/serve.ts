import { runWithServices } from 'src/dependency-injection';
import { env } from 'src/dependency-injection/env';
import Koa from 'koa';

const app = new Koa();

app.use((ctx) => {
    ctx.body = 'ok';
});

app.listen(env.HTTP_PORT, () => {
    console.log(`Listening on port ${env.HTTP_PORT}.`);

    runWithServices(['refresh'], ({ refresh }) => {
        refresh.execute();
        setInterval(() => refresh.execute().catch(console.error), 60_000);
    });
});
