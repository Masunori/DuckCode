import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

async function connectRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('Connected to Redis');
    }
}

connectRedis();

export { redisClient };