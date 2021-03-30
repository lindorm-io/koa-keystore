import { IKoaAppContext } from "@lindorm-io/koa";
import { KeyPairCache, KeyPairRepository } from "../infrastructure";
import { Keystore } from "@lindorm-io/key-pair";
import { MongoConnection } from "@lindorm-io/mongo";
import { RedisConnection } from "@lindorm-io/redis";

interface IKoaKeystoreContext extends IKoaAppContext {
  keystore: {
    [key: string]: Keystore;
  };
}

export interface IKoaRepositoryKeystoreContext extends IKoaKeystoreContext {
  mongo: MongoConnection;
  repository: {
    keyPair: KeyPairRepository;
  };
}

export interface IKoaCacheKeystoreContext extends IKoaKeystoreContext {
  redis: RedisConnection;
  cache: {
    keyPair: {
      [key: string]: KeyPairCache;
    };
  };
}
