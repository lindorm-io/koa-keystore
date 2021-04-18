import { IKoaRepositoryKeystoreContext } from "../typing";
import { KeyPairRepository } from "../infrastructure";
import { Middleware, Next } from "@lindorm-io/koa";

export const keyPairRepositoryMiddleware: Middleware = async (
  ctx: IKoaRepositoryKeystoreContext,
  next: Next,
): Promise<void> => {
  const start = Date.now();

  ctx.repository.keyPairRepository = new KeyPairRepository({
    db: await ctx.client.mongo.database(),
    logger: ctx.logger,
  });

  ctx.metrics.repository = (ctx.metrics.repository || 0) + (Date.now() - start);

  await next();
};
