// config/redis.js
import Redis from 'ioredis';
import chalk from 'chalk';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('connect', () => {
  console.log(chalk.green('✔ Redis connected successfully'));
});

redis.on('error', (error) => {
  console.error(chalk.red('✘ Redis connection error:', error.message));
});

// Cache helper functions
export const setCacheWithExpiry = async (key, value, expirySeconds = 3600) => {
  await redis.setex(key, expirySeconds, JSON.stringify(value));
};

export const getCache = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const deleteCache = async (key) => {
  await redis.del(key);
};

export const clearCache = async () => {
  await redis.flushall();
};

export default redis;