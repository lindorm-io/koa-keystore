import { IKeystoreMiddlewareOptions, IKoaRepositoryKeystoreContext } from "../typing";
import { Keystore } from "@lindorm-io/key-pair";
import { Middleware } from "koa";
import { TNext } from "@lindorm-io/koa-jwks";

export const repositoryKeystoreMiddleware = (options: IKeystoreMiddlewareOptions): Middleware => {
  const { keystoreName } = options;

  return async (ctx: IKoaRepositoryKeystoreContext, next: TNext): Promise<void> => {
    const start = Date.now();
    const keys = await ctx.repository.keyPair.findMany({});

    ctx.keystore = {
      ...(ctx.keystore || {}),
      [keystoreName]: new Keystore({ keys }),
    };

    ctx.logger.debug("keystore initialised", { amount: keys.length });

    ctx.metrics = {
      ...(ctx.metrics || {}),
      keystore: Date.now() - start,
    };

    await next();
  };
};
