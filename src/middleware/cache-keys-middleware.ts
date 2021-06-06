import { Middleware } from "@lindorm-io/koa";
import { flatten } from "lodash";
import { KeystoreContext } from "../typing";

export const cacheKeysMiddleware: Middleware<KeystoreContext> = async (ctx, next): Promise<void> => {
  const start = Date.now();

  const keys = await ctx.cache.keyPairCache.findMany({ allowed: true });

  ctx.keys = flatten([ctx.keys, keys]);

  ctx.logger.debug("keys found in cache", { amount: keys.length, total: ctx.keys.length });

  ctx.metrics.keystore = (ctx.metrics.keystore || 0) + (Date.now() - start);

  await next();
};
