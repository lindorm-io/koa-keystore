import { Middleware } from "@lindorm-io/koa";
import { KeystoreContext } from "../typing";
import { flatten } from "lodash";

export const repositoryKeysMiddleware: Middleware<KeystoreContext> = async (ctx, next): Promise<void> => {
  const start = Date.now();

  const keys = await ctx.repository.keyPairRepository.findMany({ allowed: true });

  ctx.keys = flatten([ctx.keys, keys]);

  ctx.logger.debug("keys found in repository", { amount: keys.length, total: ctx.keys.length });

  ctx.metrics.keystore = (ctx.metrics.keystore || 0) + (Date.now() - start);

  await next();
};
