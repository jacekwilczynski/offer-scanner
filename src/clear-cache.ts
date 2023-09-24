import { cache } from 'src/init/services';

await cache.clear();
console.info('Cache cleared.');
process.exit();
