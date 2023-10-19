import Koa from 'koa';
import { routes } from 'src/server/routes';

export class Server {
    private readonly app = new Koa();

    constructor(
        private readonly port: number,
    ) {
        this.app.use(routes);
    }

    listen() {
        return new Promise<void>(resolve => {
            this.app.listen(this.port, resolve);
        });
    }
}
