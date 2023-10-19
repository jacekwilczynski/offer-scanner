import * as Router from '@koa/router';

const router = new Router();
type Context = Parameters<Parameters<typeof router['use']>[1]>[0];

export const routes = router
    .get('/healthcheck', healthcheck)
    .routes();

async function healthcheck(ctx: Context) {
    ctx.body = 'ok';
}
