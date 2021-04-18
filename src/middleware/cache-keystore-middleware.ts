import { IKeystoreMiddlewareOptions, IKoaCacheKeystoreContext } from "../typing";
import { Keystore } from "@lindorm-io/key-pair";
import { Middleware, Next } from "@lindorm-io/koa";

export const cacheKeystoreMiddleware = (options: IKeystoreMiddlewareOptions): Middleware => async (
  ctx: IKoaCacheKeystoreContext,
  next: Next,
): Promise<void> => {
  const start = Date.now();

  ctx.keystore[options.keystoreName] = new Keystore({
    keys: await ctx.cache.keyPair[options.keystoreName].findAll(),
  });

  ctx.metrics.keystore = (ctx.metrics.keystore || 0) + (Date.now() - start);

  await next();
};
