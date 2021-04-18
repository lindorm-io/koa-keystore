import { IKeystoreMiddlewareOptions, IKoaCacheKeystoreContext } from "../typing";
import { KeyPairCache } from "../infrastructure";
import { Middleware, Next } from "@lindorm-io/koa";

export const keyPairCacheMiddleware = (options: IKeystoreMiddlewareOptions): Middleware => async (
  ctx: IKoaCacheKeystoreContext,
  next: Next,
): Promise<void> => {
  const start = Date.now();

  ctx.cache.keyPair = {
    ...(ctx.cache?.keyPair || {}),
  };

  ctx.cache.keyPair[options.keystoreName] = new KeyPairCache({
    client: await ctx.client.redis.client(),
    logger: ctx.logger,
    keystoreName: options.keystoreName,
  });

  ctx.metrics.cache = (ctx.metrics.cache || 0) + (Date.now() - start);

  await next();
};
