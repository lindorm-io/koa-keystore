import { KeyPairCache } from "../infrastructure";
import { RedisConnection, RedisConnectionType } from "@lindorm-io/redis";
import { logger } from "./test-logger";

export interface IGetTestCacheData {
  keyPair: KeyPairCache;
}

export const getTestCache = async (): Promise<IGetTestCacheData> => {
  const redis = new RedisConnection({
    port: 1000,
    type: RedisConnectionType.MEMORY,
    inMemoryCache: {},
  });
  await redis.connect();
  const client = redis.getClient();

  return {
    // @ts-ignore
    keyPair: new KeyPairCache({ client, logger }),
  };
};
