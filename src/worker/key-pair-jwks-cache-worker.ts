import { RedisConnectionOptions, RedisConnection } from "@lindorm-io/redis";
import { IntervalWorker } from "@lindorm-io/koa";
import { KeyPairCache } from "../infrastructure";
import { Keystore } from "@lindorm-io/key-pair";
import { Logger } from "@lindorm-io/winston";
import { WebKeyHandler } from "../class";
import { stringToSeconds } from "@lindorm-io/core";

interface Options {
  baseUrl: string;
  clientName: string;
  redisConnection?: RedisConnection;
  redisConnectionOptions?: RedisConnectionOptions;
  winston: Logger;
  workerInterval?: string;
}

export const keyPairJwksCacheWorker = (options: Options): IntervalWorker => {
  const {
    baseUrl,
    clientName,
    redisConnection,
    redisConnectionOptions,
    winston,
    workerInterval = "5 minutes",
  } = options;

  const workerIntervalInSeconds = stringToSeconds(workerInterval);
  const expiresInSeconds = workerIntervalInSeconds + 120;
  const time = workerIntervalInSeconds * 1000;
  const logger = winston.createChildLogger(["keyPairJwksCacheWorker"]);

  if (!redisConnection && !redisConnectionOptions) {
    throw new Error(
      "redis connection must be established with either [ redisConnection, redisConnectionOptions ]",
    );
  }
  if (redisConnection && redisConnectionOptions) {
    logger.warn(
      "redisConnection and redisConnectionOptions supplied. Only redisConnection will be used.",
    );
  }

  const handler = new WebKeyHandler({ baseUrl, logger, clientName });

  return new IntervalWorker({
    callback: async (): Promise<void> => {
      const redis = redisConnection
        ? redisConnection
        : new RedisConnection(redisConnectionOptions as RedisConnectionOptions);

      if (!redis.isConnected()) {
        await redis.connect();
      }

      const cache = new KeyPairCache({
        client: redis.client(),
        logger,
        expiresInSeconds,
      });

      const array = await handler.getKeys();

      for (const entity of array) {
        const expires = Keystore.getTTL(entity);
        await cache.create(entity, expires?.seconds);
      }

      if (!redisConnection) {
        await redis.disconnect();
      }
    },
    logger,
    time,
  });
};
