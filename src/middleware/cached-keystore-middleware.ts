import { IKoaAppContext } from "@lindorm-io/koa";
import { KeyPairCache } from "../infrastructure";
import { Keystore } from "@lindorm-io/key-pair";
import { TNext } from "../typing";

export interface IKoaCachedKeystoreContext extends IKoaAppContext {
  keystore: Keystore;
  cache: {
    keyPair: KeyPairCache;
  };
}

export const cachedKeystoreMiddleware = async (ctx: IKoaCachedKeystoreContext, next: TNext): Promise<void> => {
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
