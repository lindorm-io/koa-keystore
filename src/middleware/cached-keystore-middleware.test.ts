import MockDate from "mockdate";
import { cachedKeystoreMiddleware } from "./cached-keystore-middleware";
import { getTestCache, getTestKeyPairEC, getTestKeyPairRSA, logger } from "../test";

MockDate.set("2020-01-01 08:00:00.000");

const next = () => Promise.resolve();

describe("cachedKeystoreMiddleware", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: await getTestCache(),
      logger,
    };

    await ctx.cache.keyPair.create(getTestKeyPairEC());
    await ctx.cache.keyPair.create(getTestKeyPairRSA());
  });

  test("should successfully set keystore on ctx", async () => {
    await expect(cachedKeystoreMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.keystore).toMatchSnapshot();
  });
});
