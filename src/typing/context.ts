import { KoaContext } from "@lindorm-io/koa";
import { KeyPairCache, KeyPairRepository } from "../infrastructure";
import { Keystore } from "@lindorm-io/key-pair";
import { MongoConnection } from "@lindorm-io/mongo";
import { RedisConnection } from "@lindorm-io/redis";

export interface KeystoreContext extends KoaContext {
  client: {
    mongo: MongoConnection;
    redis: RedisConnection;
  };
  keystore: Record<string, Keystore>;
  cache: {
    keyPair: Record<string, KeyPairCache>;
  };
  repository: {
    keyPairRepository: KeyPairRepository;
  };
}
