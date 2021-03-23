import { IKoaAppContext } from "@lindorm-io/koa";
import { KeyPairRepository } from "../infrastructure";
import { MongoConnection } from "@lindorm-io/mongo";
import { TNext } from "../typing";

export interface IKeyPairRepositoryContext extends IKoaAppContext {
  mongo: MongoConnection;
  repository: {
    keyPair: KeyPairRepository;
  };
}

export const keyPairRepositoryMiddleware = async (ctx: IKeyPairRepositoryContext, next: TNext): Promise<void> => {
  const start = Date.now();

  const { logger, mongo } = ctx;
  const db = await mongo.getDatabase();

  ctx.repository = {
    ...(ctx.repository || {}),
    keyPair: new KeyPairRepository({ db, logger }),
  };

  logger.debug("keyPair repository connected");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    keyPairRepository: Date.now() - start,
  };

  await next();
};
