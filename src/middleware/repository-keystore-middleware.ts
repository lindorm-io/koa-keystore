import { DefaultState, Middleware } from "@lindorm-io/koa";
import { IKeystoreMiddlewareOptions, IKoaRepositoryKeystoreContext } from "../typing";
import { Keystore } from "@lindorm-io/key-pair";

export const repositoryKeystoreMiddleware =
  (options: IKeystoreMiddlewareOptions): Middleware<DefaultState, IKoaRepositoryKeystoreContext> =>
  async (ctx, next): Promise<void> => {
    const start = Date.now();

    ctx.keystore[options.keystoreName] = new Keystore({
      keys: await ctx.repository.keyPairRepository.findMany({}),
    });

    ctx.metrics.keystore = (ctx.metrics.keystore || 0) + (Date.now() - start);

    await next();
  };
