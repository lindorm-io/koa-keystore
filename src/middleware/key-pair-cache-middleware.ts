import { IKeystoreMiddlewareOptions, IKoaCacheKeystoreContext } from "../typing";
import { KeyPairCache } from "../infrastructure";
import { TNext } from "@lindorm-io/koa-jwks";
import { Middleware } from "koa";

export const keyPairCacheMiddleware = (options: IKeystoreMiddlewareOptions): Middleware => {
  const { keystoreName } = options;

  return async (ctx: IKoaCacheKeystoreContext, next: TNext): Promise<void> => {
    const start = Date.now();
    const client = await ctx.redis.getClient();

    ctx.cache = {
      ...(ctx.cache || {}),
      keyPair: {
        ...(ctx.cache.keyPair || {}),
        [keystoreName]: new KeyPairCache({ client, logger: ctx.logger, keystoreName }),
      },
    };

    ctx.logger.debug("keyPair cache connected");

    ctx.metrics = {
      ...(ctx.metrics || {}),
      keyPairCache: Date.now() - start,
    };

    await next();
  };
};
