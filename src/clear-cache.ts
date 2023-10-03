import { runWithServices } from 'src/dependency-injection';

runWithServices(['cache'], ({ cache }) => cache.clear());
