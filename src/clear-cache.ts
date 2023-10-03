import { services } from 'src/dependency-injection';

(async function () {
    const cache = await services.cache();
    await cache.clear();
    console.info('Cache cleared.');
    process.exit();
})();
