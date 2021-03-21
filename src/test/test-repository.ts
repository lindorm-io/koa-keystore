import { MongoConnection, MongoConnectionType } from "@lindorm-io/mongo";
import { KeyPairRepository } from "../infrastructure";
import { logger } from "./test-logger";

export interface IGetTestRepositoryData {
  keyPair: KeyPairRepository;
}

export const getTestRepository = async (): Promise<IGetTestRepositoryData> => {
  const mongo = new MongoConnection({
    type: MongoConnectionType.MEMORY,
    auth: { user: "user", password: "password" },
    url: { host: "host", port: 1234 },
    databaseName: "databaseName",
    inMemoryStore: {},
  });
  await mongo.connect();
  const db = mongo.getDatabase();

  return {
    // @ts-ignore
    keyPair: new KeyPairRepository({ db, logger }),
  };
};
