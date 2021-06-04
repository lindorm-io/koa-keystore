import { Middleware } from "@lindorm-io/koa";
import { JWKSMiddlewareOptions, KeystoreContext } from "../typing";
import { Keystore } from "@lindorm-io/key-pair";
import { WebKeyHandler } from "../class";

export const jwksKeystoreMiddleware =
  (options: JWKSMiddlewareOptions): Middleware<KeystoreContext> =>
  async (ctx, next): Promise<void> => {
    const start = Date.now();

    const handler = new WebKeyHandler({
      baseUrl: options.baseUrl,
      logger: ctx.logger,
      name: options.keystoreName,
    });

    ctx.keystore[options.keystoreName] = new Keystore({ keys: await handler.getKeys() });

    ctx.metrics.keystore = (ctx.metrics.keystore || 0) + (Date.now() - start);

    await next();
  };
