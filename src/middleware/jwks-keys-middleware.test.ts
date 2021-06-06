import MockDate from "mockdate";
import { Metric } from "@lindorm-io/koa";
import { getTestKeyPairEC, getTestKeyPairRSA, logger } from "../test";
import { jwksKeysMiddleware } from "./jwks-keys-middleware";

MockDate.set("2020-01-01T08:00:00.000Z");

jest.mock("../class", () => ({
  WebKeyHandler: class WebKeyHandler {
    public async getKeys() {
      return [getTestKeyPairRSA()];
    }
  },
}));

const next = () => Promise.resolve();

describe("jwksKeysMiddleware", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      keys: [getTestKeyPairEC()],
      logger,
      metrics: {},
    };
    ctx.getMetric = (key: string) => new Metric(ctx, key);
  });

  test("should successfully add keys to context", async () => {
    await expect(
      jwksKeysMiddleware({
        baseUrl: "baseUrl",
        clientName: "clientName",
      })(ctx, next),
    ).resolves.toBeUndefined();

    expect(ctx.keys).toMatchSnapshot();
    expect(ctx.metrics.keystore).toStrictEqual(expect.any(Number));
  });
});
