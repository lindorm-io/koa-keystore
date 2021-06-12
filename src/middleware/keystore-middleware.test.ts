import MockDate from "mockdate";
import { Metric } from "@lindorm-io/koa";
import { getTestKeyPairEC, getTestKeyPairRSA, logger } from "../test";
import { keystoreMiddleware } from "./keystore-middleware";
import { Keystore } from "@lindorm-io/key-pair";

MockDate.set("2021-01-01T08:00:00.000Z");

const next = () => Promise.resolve();

describe("keystoreMiddleware", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      keys: [getTestKeyPairEC(), getTestKeyPairRSA()],
      logger,
      metrics: {},
    };
    ctx.getMetric = (key: string) => new Metric(ctx, key);
  });

  test("should successfully set keystore on context", async () => {
    await expect(keystoreMiddleware(ctx, next)).resolves.toBeUndefined();

    expect(ctx.keystore).toStrictEqual(expect.any(Keystore));
    expect(ctx.keystore.getKeys()).toMatchSnapshot();
    expect(ctx.metrics.keystore).toStrictEqual(expect.any(Number));
  });
});
