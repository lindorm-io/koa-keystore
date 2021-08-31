import { IntervalWorker } from "@lindorm-io/koa";
import { KeyPairRepository } from "../infrastructure";
import { Logger } from "@lindorm-io/winston";
import { MongoConnection, MongoConnectionOptions } from "@lindorm-io/mongo";
import { add, sub } from "date-fns";
import { generateKeyPair, KeyType, NamedCurve } from "@lindorm-io/key-pair";
import { stringToDurationObject, stringToMilliseconds } from "@lindorm-io/core";

interface Options {
  keyType?: KeyType;
  mongoConnection?: MongoConnection;
  mongoConnectionOptions?: MongoConnectionOptions;
  namedCurve?: NamedCurve;
  passphrase?: string;
  rotationInterval?: string;
  winston: Logger;
  workerInterval?: string;
}

export const keyPairRotationWorker = (options: Options): IntervalWorker => {
  const {
    keyType = KeyType.EC,
    mongoConnection,
    mongoConnectionOptions,
    namedCurve = NamedCurve.P521,
    passphrase = "",
    rotationInterval = "90 days",
    winston,
    workerInterval = "1 days",
  } = options;

  const logger = winston.createChildLogger(["keyPairRotationWorker"]);

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

      const keys = await repository.findMany({ expires: { $gt: new Date() } });

      if (!keys.length) {
        logger.warn("No valid KeyPair found", { keys });

        const keyPair = await generateKeyPair({
          namedCurve,
          passphrase,
          type: keyType,
        });

        keyPair.expires = add(new Date(), stringToDurationObject(rotationInterval));

        logger.info("Generating new KeyPair", {
          id: keyPair.id,
          expires: keyPair.expires,
          namedCurve: keyPair.namedCurve,
          type: keyPair.type,
        });

        await repository.create(keyPair);
      }

      if (keys.length === 1) {
        const next = keys[0];

        if (next.expires) {
          const keyPair = await generateKeyPair({
            namedCurve,
            passphrase,
            type: keyType,
          });

          keyPair.allowed = sub(next.expires, stringToDurationObject("2 days"));
          keyPair.expires = add(next.expires, stringToDurationObject(rotationInterval));

          logger.info("");

          await repository.create(keyPair);
        } else {
          logger.warn("KeyPair will never expire", next);
        }
      }

      if (!mongoConnection) {
        await mongo.disconnect();
      }
    },
    logger,
    time: stringToMilliseconds(workerInterval),
  });
};
