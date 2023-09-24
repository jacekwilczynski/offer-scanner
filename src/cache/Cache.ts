import { RedisClientType } from 'redis';

export class Cache {
    private clientPromise: Promise<RedisClientType> | undefined;

    constructor(
        private readonly redisClient: RedisClientType,
    ) {
    }

    async get(key: string): Promise<string | null> {
        const client = await this.getClient();

        return client.get(key);
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        const client = await this.getClient();
        const options = ttlSeconds ? { EX: ttlSeconds } : undefined;
        await client.set(key, value, options);
    }

    async clear(): Promise<void> {
        const client = await this.getClient();
        await client.flushDb();
    }

    private async getClient() {
        if (!this.clientPromise) {
            this.clientPromise = this.redisClient.connect();
        }

        return this.clientPromise;
    }
}
