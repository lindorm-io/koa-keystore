import { KoaContext } from "@lindorm-io/koa";
import { KeyPairCache, KeyPairRepository } from "../infrastructure";
import { Keystore } from "@lindorm-io/key-pair";
import { MongoConnection } from "@lindorm-io/mongo";
import { RedisConnection } from "@lindorm-io/redis";

export interface KeystoreContext extends KoaContext {
  keystore: {
    [key: string]: Keystore;
  };
}

export interface RepositoryKeystoreContext extends KeystoreContext {
  client: {
    mongo: MongoConnection;
  };
  repository: {
    keyPairRepository: KeyPairRepository;
  };
}

export interface CacheKeystoreContext extends KeystoreContext {
  client: {
    redis: RedisConnection;
  };
  cache: {
    keyPair: {
      [key: string]: KeyPairCache;
    };
  };
}
