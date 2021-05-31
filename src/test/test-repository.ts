import { KeyPairRepository } from "../infrastructure";
import { getTestMongo } from "./test-mongo";
import { logger } from "./test-logger";

export interface IGetTestRepositoryData {
  keyPairRepository: KeyPairRepository;
}

export const getTestRepository = async (): Promise<IGetTestRepositoryData> => {
  const mongo = await getTestMongo();
  const db = mongo.database();

  return {
    keyPairRepository: new KeyPairRepository({ db, logger }),
  };
};
