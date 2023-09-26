import { cache } from 'src/init/services';

(async function () {
    await cache.clear();
    console.info('Cache cleared.');
    process.exit();
})();
