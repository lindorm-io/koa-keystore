import { KeyPairRepository } from "../infrastructure";
import { getTestMongo } from "./test-mongo";
import { logger } from "./test-logger";

interface Data {
  keyPairRepository: KeyPairRepository;
}

export const getTestRepository = async (): Promise<Data> => {
  const mongo = await getTestMongo();
  const db = mongo.database();

  return {
    keyPairRepository: new KeyPairRepository({ db, logger }),
  };
};
