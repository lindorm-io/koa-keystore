import { Middleware } from "@lindorm-io/koa";
import { KeystoreMiddlewareOptions, CacheKeystoreContext } from "../typing";
import { Keystore } from "@lindorm-io/key-pair";

export const cacheKeystoreMiddleware =
  (options: KeystoreMiddlewareOptions): Middleware<CacheKeystoreContext> =>
  async (ctx, next): Promise<void> => {
    const start = Date.now();

    ctx.keystore[options.keystoreName] = new Keystore({
      keys: await ctx.cache.keyPair[options.keystoreName].findAll(),
    });

    ctx.metrics.keystore = (ctx.metrics.keystore || 0) + (Date.now() - start);

    await next();
  };
