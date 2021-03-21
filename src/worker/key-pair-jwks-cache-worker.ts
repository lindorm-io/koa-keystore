import { IRedisConnectionOptions, RedisConnection } from "@lindorm-io/redis";
import { IntervalWorker } from "@lindorm-io/koa";
import { KeyPairCache } from "../infrastructure";
import { Logger } from "@lindorm-io/winston";
import { WebKeyHandler } from "@lindorm-io/koa-jwks";

export interface IKeyPairJwksCacheWorkerOptions {
  jwksHost: string;
  redisConnectionOptions: IRedisConnectionOptions;
  winston: Logger;
  workerIntervalInSeconds: number;
}

export const keyPairJwksCacheWorker = (options: IKeyPairJwksCacheWorkerOptions): IntervalWorker => {
  const { jwksHost, redisConnectionOptions, winston, workerIntervalInSeconds } = options;

  const logger = winston.createChildLogger(["keyPairJwksCacheWorker"]);

  return new IntervalWorker({
    callback: async (): Promise<void> => {
      const handler = new WebKeyHandler({ host: jwksHost, logger });

      const redis = new RedisConnection(redisConnectionOptions);
      await redis.connect();
      const cache = new KeyPairCache({
        client: redis.getClient(),
        logger,
        expiresInSeconds: workerIntervalInSeconds + 120,
      });

      const array = await handler.getKeys();

      for (const entity of array) {
        await cache.create(entity);
      }

      await redis.disconnect();
    },
    logger,
    time: workerIntervalInSeconds * 1000,
  });
};
