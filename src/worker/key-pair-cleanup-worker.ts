import { IntervalWorker } from "@lindorm-io/koa";
import { KeyPairRepository } from "../infrastructure";
import { Logger } from "@lindorm-io/winston";
import { MongoConnectionOptions, MongoConnection } from "@lindorm-io/mongo";
import { stringToSeconds } from "@lindorm-io/core";

interface Options {
  mongoConnection?: MongoConnection;
  mongoConnectionOptions?: MongoConnectionOptions;
  winston: Logger;
  workerInterval?: string;
}

export const keyPairCleanupWorker = (options: Options): IntervalWorker => {
  const { mongoConnection, mongoConnectionOptions, winston, workerInterval = "1 days" } = options;

  const workerIntervalInSeconds = stringToSeconds(workerInterval);
  const time = workerIntervalInSeconds * 1000;
  const logger = winston.createChildLogger(["keyPairMongoCacheWorker"]);

  if (!mongoConnection && !mongoConnectionOptions) {
    throw new Error("mongo connection must be established with either [ mongoConnection, mongoConnectionOptions ]");
  }
  if (mongoConnection && mongoConnectionOptions) {
    logger.warn("mongoConnection and mongoConnectionOptions supplied. Only mongoConnection will be used.");
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

      await repository.removeMany({ expires: { $lt: new Date() } });

      if (!mongoConnection) {
        await mongo.disconnect();
      }
    },
    logger,
    time,
  });
};
