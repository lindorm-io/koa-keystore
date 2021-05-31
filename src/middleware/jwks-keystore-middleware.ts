import { DefaultState, Middleware } from "@lindorm-io/koa";
import { IJsonWebKeySetsMiddlewareOptions, IKoaKeystoreContext } from "../typing";
import { Keystore } from "@lindorm-io/key-pair";
import { WebKeyHandler } from "../class";

export const jwksKeystoreMiddleware =
  (options: IJsonWebKeySetsMiddlewareOptions): Middleware<DefaultState, IKoaKeystoreContext> =>
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
