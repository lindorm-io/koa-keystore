import { KeyPairCache } from "../infrastructure";
import { RedisConnection, RedisConnectionType } from "@lindorm-io/redis";
import { inMemoryCache } from "./in-memory";
import { logger } from "./test-logger";

export interface IGetTestCacheData {
  keyPair: {
    [key: string]: KeyPairCache;
  };
}

export const getTestCache = async (): Promise<IGetTestCacheData> => {
  const redis = new RedisConnection({
    port: 1000,
    type: RedisConnectionType.MEMORY,
    inMemoryCache,
  });
  await redis.connect();
  const client = redis.getClient();

  return {
    keyPair: {
      keystoreName: new KeyPairCache({
        client,
        keystoreName: "keystoreName",
        // @ts-ignore
        logger,
      }),
    },
  };
};
