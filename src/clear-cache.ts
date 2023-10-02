import { services } from 'src/services';

(async function () {
    const cache = await services.cache();
    await cache.clear();
    console.info('Cache cleared.');
    process.exit();
})();
