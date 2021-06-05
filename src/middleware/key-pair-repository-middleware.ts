import { Middleware } from "@lindorm-io/koa";
import { KeystoreContext } from "../typing";
import { KeyPairRepository } from "../infrastructure";

export const keyPairRepositoryMiddleware: Middleware<KeystoreContext> = async (ctx, next): Promise<void> => {
  const start = Date.now();

  ctx.repository.keyPairRepository = new KeyPairRepository({
    db: await ctx.client.mongo.database(),
    logger: ctx.logger,
  });

  ctx.metrics.repository = (ctx.metrics.repository || 0) + (Date.now() - start);

  await next();
};
