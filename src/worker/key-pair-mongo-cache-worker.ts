import { MongoConnectionOptions, MongoConnection } from "@lindorm-io/mongo";
import { RedisConnectionOptions, RedisConnection } from "@lindorm-io/redis";
import { IntervalWorker } from "@lindorm-io/koa";
import { KeyPairCache } from "../infrastructure";
import { KeyPairRepository } from "../infrastructure";
import { Keystore } from "@lindorm-io/key-pair";
import { Logger } from "@lindorm-io/winston";

interface Options {
  mongoConnection?: MongoConnection;
  mongoConnectionOptions?: MongoConnectionOptions;
  redisConnection?: RedisConnection;
  redisConnectionOptions?: RedisConnectionOptions;
  winston: Logger;
  workerIntervalInSeconds: number;
}

export const keyPairMongoCacheWorker = (options: Options): IntervalWorker => {
  const {
    mongoConnection,
    mongoConnectionOptions,
    redisConnection,
    redisConnectionOptions,
    winston,
    workerIntervalInSeconds,
  } = options;

  const expiresInSeconds = workerIntervalInSeconds + 120;
  const time = workerIntervalInSeconds * 1000;
  const logger = winston.createChildLogger(["keyPairMongoCacheWorker"]);

  if (!mongoConnection && !mongoConnectionOptions) {
    throw new Error("mongo connection must be established with either [ mongoConnection, mongoConnectionOptions ]");
  }
  if (!redisConnection && !redisConnectionOptions) {
    throw new Error("redis connection must be established with either [ redisConnection, redisConnectionOptions ]");
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

      const array = await repository.findMany({ allowed: true });

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
