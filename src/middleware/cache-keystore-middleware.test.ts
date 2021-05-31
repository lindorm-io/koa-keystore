import MockDate from "mockdate";
import { cacheKeystoreMiddleware } from "./cache-keystore-middleware";
import { getTestCache, getTestKeyPairEC, getTestKeyPairRSA, logger } from "../test";

MockDate.set("2020-01-01T08:00:00.000Z");

const next = jest.fn();

describe("cachedKeystoreMiddleware", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: await getTestCache(),
      keystore: {},
      logger,
      metrics: {},
    };

    await ctx.cache.keyPair.keystoreName.create(getTestKeyPairEC());
    await ctx.cache.keyPair.keystoreName.create(getTestKeyPairRSA());
  });

  test("should successfully set keystore on ctx", async () => {
    await expect(
      cacheKeystoreMiddleware({
        keystoreName: "keystoreName",
      })(ctx, next),
    ).resolves.toBe(undefined);

    expect(ctx.keystore).toMatchSnapshot();
    expect(ctx.metrics.keystore).toStrictEqual(expect.any(Number));
  });
});
