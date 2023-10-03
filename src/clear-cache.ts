import { services } from 'src/infrastructure/dependency-injection';

(async function () {
    const cache = await services.cache();
    await cache.clear();
    console.info('Cache cleared.');
    process.exit();
})();
