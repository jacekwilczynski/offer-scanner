import * as path from 'path';
import Koa from 'koa';
import * as serve from 'koa-static';
import { routes } from 'src/server/routes';

export class Server {
    private readonly app = new Koa();

    constructor(projectDir: string) {
        this.app.use(routes);
        this.app.use(serve(path.join(projectDir, 'public')));
    }

    listen(port: number) {
        return new Promise<void>(resolve => {
            this.app.listen(port, resolve);
        });
    }
}
