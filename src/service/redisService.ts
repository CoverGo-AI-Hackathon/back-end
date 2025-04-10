import redis from 'redis'
import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

export default {
    redisClient: redisClient,
    setItem: async (key:string, value:string, ttl:number) => {
        try {
            await redisClient.set(key, value, {EX: ttl});  
        } catch (err: any) {
            console.error(`Error setting key ${key}: ${err.message}`);
        }
    },

    getItem: async (key: string) => {
        try {
            const value = await redisClient.get(key);
            if (value) {
                return value;
            } else {
                return null;
            }
        } catch (err: any) {
            console.error(`Error getting key ${key}: ${err.message}`);
            return null;
        }
    },

    deleteItem: async (key: string) => {
        try {
            const result = await redisClient.del(key);
            if (result > 0) {
                console.log(`Key: ${key} deleted from Redis.`);
            } else {
                console.log(`Key: ${key} not found in Redis.`);
            }
        } catch (err: any) {
            console.error(`Error deleting key ${key}: ${err.message}`);
        }
    },
}