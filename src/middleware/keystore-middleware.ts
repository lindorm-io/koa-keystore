import { TPromise } from "../typing";
import { Keystore } from "@lindorm-io/key-pair";
import { IKoaAppContext } from "@lindorm-io/koa";
import { KeyPairRepository } from "../infrastructure";

export interface IKoaKeystoreContext extends IKoaAppContext {
  keystore: Keystore;
  repository: {
    keyPair: KeyPairRepository;
  };
}

export const keystoreMiddleware = async (ctx: IKoaKeystoreContext, next: TPromise<void>): Promise<void> => {
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
