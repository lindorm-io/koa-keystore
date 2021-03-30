import { IKeystoreMiddlewareOptions, IKoaCacheKeystoreContext } from "../typing";
import { Keystore } from "@lindorm-io/key-pair";
import { Middleware } from "koa";
import { TNext } from "@lindorm-io/koa-jwks";

export const cacheKeystoreMiddleware = (options: IKeystoreMiddlewareOptions): Middleware => {
  const { keystoreName } = options;

  return async (ctx: IKoaCacheKeystoreContext, next: TNext): Promise<void> => {
    const start = Date.now();
    const keys = await ctx.cache.keyPair[keystoreName].findAll();

    ctx.keystore = {
      ...(ctx.keystore || {}),
      [keystoreName]: new Keystore({ keys }),
    };

    ctx.logger.debug("cached keystore initialised", { amount: keys.length });

    ctx.metrics = {
      ...(ctx.metrics || {}),
      cachedKeystore: Date.now() - start,
    };

    await next();
  };
};
