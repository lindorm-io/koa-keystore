import { IKoaCacheKeystoreContext } from "../typing";
import { KeyPairCache } from "../infrastructure";
import { TNext } from "@lindorm-io/koa-jwks";

export const keyPairCacheMiddleware = async (ctx: IKoaCacheKeystoreContext, next: TNext): Promise<void> => {
  const start = Date.now();
  const client = await ctx.redis.getClient();

  ctx.cache = {
    ...(ctx.cache || {}),
    keyPair: new KeyPairCache({ client, logger: ctx.logger }),
  };

  ctx.logger.debug("keyPair cache connected");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    keyPairCache: Date.now() - start,
  };

  await next();
};
