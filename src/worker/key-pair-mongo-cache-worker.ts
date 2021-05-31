import { IMongoConnectionOptions, MongoConnection } from "@lindorm-io/mongo";
import { IRedisConnectionOptions, RedisConnection } from "@lindorm-io/redis";
import { IntervalWorker } from "@lindorm-io/koa";
import { KeyPairCache } from "../infrastructure";
import { KeyPairRepository } from "../infrastructure";
import { Keystore } from "@lindorm-io/key-pair";
import { Logger } from "@lindorm-io/winston";

export interface IKeyPairMongoCacheWorkerOptions {
  keystoreName: string;
  mongoConnectionOptions: IMongoConnectionOptions;
  redisConnectionOptions: IRedisConnectionOptions;
  winston: Logger;
  workerIntervalInSeconds: number;
}

export const keyPairMongoCacheWorker = (options: IKeyPairMongoCacheWorkerOptions): IntervalWorker => {
  const { keystoreName, mongoConnectionOptions, redisConnectionOptions, winston, workerIntervalInSeconds } = options;
  const expiresInSeconds = workerIntervalInSeconds + 120;
  const time = workerIntervalInSeconds * 1000;
  const logger = winston.createChildLogger(["keyPairMongoCacheWorker"]);

  return new IntervalWorker({
    callback: async (): Promise<void> => {
      const mongo = new MongoConnection(mongoConnectionOptions);
      await mongo.connect();
      const repository = new KeyPairRepository({
        db: mongo.database(),
        logger,
      });

      const redis = new RedisConnection(redisConnectionOptions);
      await redis.connect();
      const cache = new KeyPairCache({
        client: redis.client(),
        logger,
        expiresInSeconds,
        keystoreName,
      });

      const array = await repository.findMany({});

      for (const entity of array) {
        if (!Keystore.isKeyUsable(entity)) continue;
        const expires = Keystore.getTTL(entity);
        await cache.create(entity, expires?.seconds);
      }

      await mongo.disconnect();
      await redis.disconnect();
    },
    logger,
    time,
  });
};
