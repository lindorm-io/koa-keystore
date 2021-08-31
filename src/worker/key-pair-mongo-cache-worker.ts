import { MongoConnectionOptions, MongoConnection } from "@lindorm-io/mongo";
import { RedisConnectionOptions, RedisConnection } from "@lindorm-io/redis";
import { IntervalWorker } from "@lindorm-io/koa";
import { KeyPairCache } from "../infrastructure";
import { KeyPairRepository } from "../infrastructure";
import { Keystore } from "@lindorm-io/key-pair";
import { Logger } from "@lindorm-io/winston";
import { stringToSeconds } from "@lindorm-io/core";

interface Options {
  mongoConnection?: MongoConnection;
  mongoConnectionOptions?: MongoConnectionOptions;
  redisConnection?: RedisConnection;
  redisConnectionOptions?: RedisConnectionOptions;
  winston: Logger;
  workerInterval?: string;
}

export const keyPairMongoCacheWorker = (options: Options): IntervalWorker => {
  const {
    mongoConnection,
    mongoConnectionOptions,
    redisConnection,
    redisConnectionOptions,
    winston,
    workerInterval = "1 hours",
  } = options;

  const workerIntervalInSeconds = stringToSeconds(workerInterval);
  const expiresInSeconds = workerIntervalInSeconds + 120;
  const time = workerIntervalInSeconds * 1000;
  const logger = winston.createChildLogger(["keyPairMongoCacheWorker"]);

  if (!mongoConnection && !mongoConnectionOptions) {
    throw new Error(
      "mongo connection must be established with either [ mongoConnection, mongoConnectionOptions ]",
    );
  }
  if (mongoConnection && mongoConnectionOptions) {
    logger.warn(
      "mongoConnection and mongoConnectionOptions supplied. Only mongoConnection will be used.",
    );
  }

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

  return new IntervalWorker({
    callback: async (): Promise<void> => {
      const mongo = mongoConnection
        ? mongoConnection
        : new MongoConnection(mongoConnectionOptions as MongoConnectionOptions);

      if (!mongo.isConnected()) {
        await mongo.connect();
      }

      const repository = new KeyPairRepository({
        db: mongo.database(),
        logger,
      });

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

      const array = await repository.findMany({});

      for (const entity of array) {
        const expires = Keystore.getTTL(entity);
        await cache.create(entity, expires?.seconds);
      }

      if (!mongoConnection) {
        await mongo.disconnect();
      }
      if (!redisConnection) {
        await redis.disconnect();
      }
    },
    logger,
    time,
  });
};
