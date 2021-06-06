import { Middleware } from "@lindorm-io/koa";
import { KeystoreContext } from "../typing";
import { Keystore } from "@lindorm-io/key-pair";

export const keystoreMiddleware: Middleware<KeystoreContext> = async (ctx, next): Promise<void> => {
  const start = Date.now();

  ctx.keystore = new Keystore({ keys: ctx.keys });

  ctx.logger.debug("keystore initialised", { amount: ctx.keys.length });

  ctx.metrics.keystore = (ctx.metrics.keystore || 0) + (Date.now() - start);

  await next();
};
