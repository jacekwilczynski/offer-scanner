import * as http from 'http';
import { runWithServices } from 'src/dependency-injection';

// required though unneeded (we only have a cron) healthcheck for DigitalOcean
http
    .createServer((req, res) => {
        res.write('ok');
        res.end();
    })
    .listen(8080, () => {
        console.log('Healthcheck endpoint listening on port 8080.')

        runWithServices(['refresh'], async ({ refresh }) => {
            setInterval(() => refresh.execute().catch(console.error), 60_000);
        });
    });

