import { services } from 'src/dependency-injection';

(async function () {
    const refresh = await services.refresh();
    await refresh.execute();
    process.exit();
})();
