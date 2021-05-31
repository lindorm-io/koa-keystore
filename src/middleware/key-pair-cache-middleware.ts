import { DefaultState, Middleware } from "@lindorm-io/koa";
import { IKeystoreMiddlewareOptions, IKoaCacheKeystoreContext } from "../typing";
import { KeyPairCache } from "../infrastructure";

export const keyPairCacheMiddleware =
  (options: IKeystoreMiddlewareOptions): Middleware<DefaultState, IKoaCacheKeystoreContext> =>
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
