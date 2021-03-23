import { IKoaAppContext } from "@lindorm-io/koa";
import { KeyPairRepository } from "../infrastructure";
import { Keystore } from "@lindorm-io/key-pair";
import { TNext } from "../typing";

export interface IKoaKeystoreContext extends IKoaAppContext {
  keystore: Keystore;
  repository: {
    keyPair: KeyPairRepository;
  };
}

export const keystoreMiddleware = async (ctx: IKoaKeystoreContext, next: TNext): Promise<void> => {
  const start = Date.now();

  const { logger, repository } = ctx;

  const keys = await repository.keyPair.findMany({});

  ctx.keystore = new Keystore({ keys });

  logger.debug("keystore initialised", { amount: keys.length });

  ctx.metrics = {
    ...(ctx.metrics || {}),
    keystore: Date.now() - start,
  };

  await next();
};
