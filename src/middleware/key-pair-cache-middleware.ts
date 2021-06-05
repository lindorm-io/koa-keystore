import { Middleware } from "@lindorm-io/koa";
import { KeystoreMiddlewareOptions, KeystoreContext } from "../typing";
import { KeyPairCache } from "../infrastructure";

export const keyPairCacheMiddleware =
  (options: KeystoreMiddlewareOptions): Middleware<KeystoreContext> =>
  async (ctx, next): Promise<void> => {
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
