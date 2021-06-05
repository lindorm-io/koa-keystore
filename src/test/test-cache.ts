import { KeyPairCache } from "../infrastructure";
import { getTestRedis } from "./test-redis";
import { logger } from "./test-logger";

interface Data {
  keyPair: {
    [key: string]: KeyPairCache;
  };
}

export const getTestCache = async (): Promise<Data> => {
  const redis = await getTestRedis();
  const client = redis.client();

  return {
    keyPair: {
      keystoreName: new KeyPairCache({
        client,
        keystoreName: "keystoreName",
        logger,
      }),
    },
  };
};
