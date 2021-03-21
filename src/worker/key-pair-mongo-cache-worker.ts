import { IMongoConnectionOptions, MongoConnection } from "@lindorm-io/mongo";
import { IRedisConnectionOptions, RedisConnection } from "@lindorm-io/redis";
import { IntervalWorker } from "@lindorm-io/koa";
import { KeyPairCache } from "../infrastructure";
import { KeyPairRepository } from "../infrastructure";
import { Logger } from "@lindorm-io/winston";

export interface IKeyPairMongoCacheWorkerOptions {
  mongoConnectionOptions: IMongoConnectionOptions;
  redisConnectionOptions: IRedisConnectionOptions;
  winston: Logger;
  workerIntervalInSeconds: number;
}

export const keyPairMongoCacheWorker = (options: IKeyPairMongoCacheWorkerOptions): IntervalWorker => {
  const { mongoConnectionOptions, redisConnectionOptions, winston, workerIntervalInSeconds } = options;

  const logger = winston.createChildLogger(["keyPairMongoCacheWorker"]);

  return new IntervalWorker({
    callback: async (): Promise<void> => {
      const mongo = new MongoConnection(mongoConnectionOptions);
      await mongo.connect();
      const repository = new KeyPairRepository({
        db: mongo.getDatabase(),
        logger,
      });

      const redis = new RedisConnection(redisConnectionOptions);
      await redis.connect();
      const cache = new KeyPairCache({
        client: redis.getClient(),
        logger,
        expiresInSeconds: workerIntervalInSeconds + 120,
      });

      const array = await repository.findMany({});

      for (const entity of array) {
        await cache.create(entity);
      }

      await mongo.disconnect();
      await redis.disconnect();
    },
    logger,
    time: workerIntervalInSeconds * 1000,
  });
};
