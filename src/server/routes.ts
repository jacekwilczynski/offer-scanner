import * as Router from '@koa/router';
import { runWithServices } from 'src/dependency-injection';

const router = new Router();
type Context = Parameters<Parameters<typeof router['use']>[1]>[0];

export const routes = router
    .get('/healthcheck', healthcheck)
    .get('/new-offers', getNewOffers)
    .routes();

async function healthcheck(ctx: Context) {
    ctx.body = 'ok';
}

async function getNewOffers(ctx: Context) {
    await runWithServices(
        ['bufferedNotifier', 'refresh'],
        async ({ bufferedNotifier, refresh }) => {
            await refresh.execute();
            ctx.body = bufferedNotifier.listings;
        },
    );
}
