import { IKeystoreMiddlewareOptions, IKoaRepositoryKeystoreContext } from "../typing";
import { Keystore } from "@lindorm-io/key-pair";
import { Middleware, Next } from "@lindorm-io/koa";

export const repositoryKeystoreMiddleware = (options: IKeystoreMiddlewareOptions): Middleware => async (
  ctx: IKoaRepositoryKeystoreContext,
  next: Next,
): Promise<void> => {
  const start = Date.now();

  ctx.keystore[options.keystoreName] = new Keystore({
    keys: await ctx.repository.keyPairRepository.findMany({}),
  });

  ctx.metrics.keystore = (ctx.metrics.keystore || 0) + (Date.now() - start);

  await next();
};
