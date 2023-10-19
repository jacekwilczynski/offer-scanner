import Koa from 'koa';
import { routes } from 'src/server/routes';

export class Server {
    private readonly app = new Koa();

    constructor() {
        this.app.use(routes);
    }

    listen(port: number) {
        return new Promise<void>(resolve => {
            this.app.listen(port, resolve);
        });
    }
}
