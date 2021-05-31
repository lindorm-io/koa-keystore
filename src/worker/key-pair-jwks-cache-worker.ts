import { IRedisConnectionOptions, RedisConnection } from "@lindorm-io/redis";
import { IntervalWorker } from "@lindorm-io/koa";
import { KeyPairCache } from "../infrastructure";
import { Keystore } from "@lindorm-io/key-pair";
import { Logger } from "@lindorm-io/winston";
import { WebKeyHandler } from "../class";

export interface IKeyPairJwksCacheWorkerOptions {
  baseUrl: string;
  keystoreName: string;
  redisConnectionOptions: IRedisConnectionOptions;
  winston: Logger;
  workerIntervalInSeconds: number;
}

export const keyPairJwksCacheWorker = (options: IKeyPairJwksCacheWorkerOptions): IntervalWorker => {
  const { baseUrl, keystoreName, redisConnectionOptions, winston, workerIntervalInSeconds } = options;
  const expiresInSeconds = workerIntervalInSeconds + 120;
  const time = workerIntervalInSeconds * 1000;
  const logger = winston.createChildLogger(["keyPairJwksCacheWorker"]);

  return new IntervalWorker({
    callback: async (): Promise<void> => {
      const handler = new WebKeyHandler({ baseUrl, logger, name: keystoreName });

      const redis = new RedisConnection(redisConnectionOptions);
      await redis.connect();
      const cache = new KeyPairCache({
        client: redis.client(),
        logger,
        expiresInSeconds,
        keystoreName,
      });

      const array = await handler.getKeys();

      for (const entity of array) {
        if (!Keystore.isKeyUsable(entity)) continue;
        const expires = Keystore.getTTL(entity);
        await cache.create(entity, expires?.seconds);
      }

      await redis.disconnect();
    },
    logger,
    time,
  });
};
