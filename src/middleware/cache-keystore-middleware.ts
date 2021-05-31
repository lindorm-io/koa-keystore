import { DefaultState, Middleware } from "@lindorm-io/koa";
import { IKeystoreMiddlewareOptions, IKoaCacheKeystoreContext } from "../typing";
import { Keystore } from "@lindorm-io/key-pair";

export const cacheKeystoreMiddleware =
  (options: IKeystoreMiddlewareOptions): Middleware<DefaultState, IKoaCacheKeystoreContext> =>
  async (ctx, next): Promise<void> => {
    const start = Date.now();

    ctx.keystore[options.keystoreName] = new Keystore({
      keys: await ctx.cache.keyPair[options.keystoreName].findAll(),
    });

    ctx.metrics.keystore = (ctx.metrics.keystore || 0) + (Date.now() - start);

    await next();
  };
