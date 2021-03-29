import { IKoaRepositoryKeystoreContext } from "../typing";
import { KeyPairRepository } from "../infrastructure";
import { TNext } from "@lindorm-io/koa-jwks";

export const keyPairRepositoryMiddleware = async (ctx: IKoaRepositoryKeystoreContext, next: TNext): Promise<void> => {
  const start = Date.now();
  const db = await ctx.mongo.getDatabase();

  ctx.repository = {
    ...(ctx.repository || {}),
    keyPair: new KeyPairRepository({ db, logger: ctx.logger }),
  };

  ctx.logger.debug("keyPair repository connected");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    keyPairRepository: Date.now() - start,
  };

  await next();
};
