import { RedisConnection, RedisConnectionType } from "@lindorm-io/redis";
import { inMemoryCache } from "./in-memory";

export const getTestRedis = async (): Promise<RedisConnection> => {
  const redis = new RedisConnection({
    port: 1000,
    type: RedisConnectionType.MEMORY,
    inMemoryCache,
  });
  await redis.connect();
  return redis;
};
