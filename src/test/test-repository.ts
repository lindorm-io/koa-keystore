import { KeyPairRepository } from "../infrastructure";
import { getTestMongo } from "./test-mongo";
import { logger } from "./test-logger";

export interface IGetTestRepositoryData {
  keyPair: KeyPairRepository;
}

export const getTestRepository = async (): Promise<IGetTestRepositoryData> => {
  const mongo = await getTestMongo();
  const db = mongo.getDatabase();

  return {
    // @ts-ignore
    keyPair: new KeyPairRepository({ db, logger }),
  };
};
