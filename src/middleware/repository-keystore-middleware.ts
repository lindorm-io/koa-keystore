import { Middleware } from "@lindorm-io/koa";
import { KeystoreMiddlewareOptions, KeystoreContext } from "../typing";
import { Keystore } from "@lindorm-io/key-pair";

export const repositoryKeystoreMiddleware =
  (options: KeystoreMiddlewareOptions): Middleware<KeystoreContext> =>
  async (ctx, next): Promise<void> => {
    const start = Date.now();

    ctx.keystore[options.keystoreName] = new Keystore({
      keys: await ctx.repository.keyPairRepository.findMany({}),
    });

    ctx.metrics.keystore = (ctx.metrics.keystore || 0) + (Date.now() - start);

    await next();
  };
