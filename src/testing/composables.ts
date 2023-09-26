import { afterAll } from '@jest/globals';
import { dataSource } from 'src/services/database';

export function useDatabase() {
    afterAll(async () => {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    });
}
