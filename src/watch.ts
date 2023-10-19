import * as http from 'http';
import { runWithServices } from 'src/dependency-injection';
import { env } from 'src/dependency-injection/env';

// required though unneeded (we only have a cron) healthcheck for DigitalOcean
http
    .createServer((req, res) => {
        res.write('ok');
        res.end();
    })
    .listen(env.HTTP_PORT, () => {
        console.log(`Healthcheck endpoint listening on port ${env.HTTP_PORT}.`)

        runWithServices(['refresh'], ({ refresh }) => {
            refresh.execute();
            setInterval(() => refresh.execute().catch(console.error), 60_000);
        });
    });
