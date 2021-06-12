import MockDate from "mockdate";
import { Metric } from "@lindorm-io/koa";
import { cacheKeysMiddleware } from "./cache-keys-middleware";
import { getTestCache, getTestKeyPairEC, getTestKeyPairRSA, logger } from "../test";

MockDate.set("2021-01-01T08:00:00.000Z");

const next = () => Promise.resolve();

describe("cacheKeysMiddleware", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: await getTestCache(),
      keys: [getTestKeyPairEC()],
      logger,
      metrics: {},
    };
    ctx.getMetric = (key: string) => new Metric(ctx, key);

    await ctx.cache.keyPairCache.create(getTestKeyPairRSA());
  });

  test("should successfully add keys to context", async () => {
    await expect(cacheKeysMiddleware(ctx, next)).resolves.toBeUndefined();

    expect(ctx.keys).toMatchSnapshot();
    expect(ctx.metrics.keystore).toStrictEqual(expect.any(Number));
  });
});
