import { TPromise } from "../typing";
import { Keystore } from "@lindorm-io/key-pair";
import { IKoaAppContext } from "@lindorm-io/koa";
import { KeyPairCache } from "../infrastructure";

export interface IKoaCachedKeystoreContext extends IKoaAppContext {
  keystore: Keystore;
  cache: {
    keyPair: KeyPairCache;
  };
}

export const cachedKeystoreMiddleware = async (ctx: IKoaCachedKeystoreContext, next: TPromise<void>): Promise<void> => {
  const start = Date.now();

  const { cache, logger } = ctx;

  const keys = await cache.keyPair.findAll();

  ctx.keystore = new Keystore({ keys });

  logger.debug("cached keystore initialised", { amount: keys.length });

  ctx.metrics = {
    ...(ctx.metrics || {}),
    cachedKeystore: Date.now() - start,
  };

  await next();
};
