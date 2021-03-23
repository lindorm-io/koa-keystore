import { IKoaAppContext } from "@lindorm-io/koa";
import { KeyPairCache } from "../infrastructure";
import { RedisConnection } from "@lindorm-io/redis";
import { TNext } from "../typing";

export interface IKeyPairCacheContext extends IKoaAppContext {
  redis: RedisConnection;
  cache: {
    keyPair: KeyPairCache;
  };
}

export const keyPairCacheMiddleware = async (ctx: IKeyPairCacheContext, next: TNext): Promise<void> => {
  const start = Date.now();

  const { redis, logger } = ctx;
  const client = await redis.getClient();

  ctx.cache = {
    ...(ctx.cache || {}),
    keyPair: new KeyPairCache({ client, logger }),
  };

  logger.debug("keyPair cache connected");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    keyPairCache: Date.now() - start,
  };

  await next();
};
