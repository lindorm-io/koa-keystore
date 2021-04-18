import MockDate from "mockdate";
import { getTestRedis, logger } from "../test";
import { keyPairCacheMiddleware } from "./key-pair-cache-middleware";
import { KeyPairCache } from "../infrastructure";

MockDate.set("2020-01-01 08:00:00.000");

const next = jest.fn();

describe("keyPairCacheMiddleware", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: {},
      client: { redis: await getTestRedis() },
      logger,
      metrics: {},
    };
  });

  test("should set a key-pair cache on context", async () => {
    await expect(
      keyPairCacheMiddleware({
        keystoreName: "keystoreName",
      })(ctx, next),
    ).resolves.toBe(undefined);

    expect(ctx.cache.keyPair.keystoreName).toStrictEqual(expect.any(KeyPairCache));
    expect(ctx.metrics.cache).toStrictEqual(expect.any(Number));
  });
});
