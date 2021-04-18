import { KeyPairCache } from "../infrastructure";
import { getTestRedis } from "./test-redis";
import { logger } from "./test-logger";

export interface IGetTestCacheData {
  keyPair: {
    [key: string]: KeyPairCache;
  };
}

export const getTestCache = async (): Promise<IGetTestCacheData> => {
  const redis = await getTestRedis();
  const client = redis.client();

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
