import { cache } from 'src/services';

(async function () {
    await cache.clear();
    console.info('Cache cleared.');
    process.exit();
})();
