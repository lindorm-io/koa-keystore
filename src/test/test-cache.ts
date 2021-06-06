import { KeyPairCache } from "../infrastructure";
import { getTestRedis } from "./test-redis";
import { logger } from "./test-logger";

interface Data {
  keyPairCache: KeyPairCache;
}

export const getTestCache = async (): Promise<Data> => {
  const redis = await getTestRedis();
  const client = redis.client();

  return {
    keyPairCache: new KeyPairCache({
      client,
      logger,
    }),
  };
};
