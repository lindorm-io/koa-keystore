import MockDate from "mockdate";
import { Metric } from "@lindorm-io/koa";
import { getTestKeyPairEC, getTestKeyPairRSA, getTestRepository, logger } from "../test";
import { repositoryKeysMiddleware } from "./repository-keys-middleware";

MockDate.set("2021-01-01T08:00:00.000Z");

const next = () => Promise.resolve();

describe("repositoryKeysMiddleware", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      keys: [getTestKeyPairEC()],
      logger,
      metrics: {},
      repository: await getTestRepository(),
    };
    ctx.getMetric = (key: string) => new Metric(ctx, key);

    await ctx.repository.keyPairRepository.create(getTestKeyPairRSA());
  });

  test("should successfully add keys to context", async () => {
    await expect(repositoryKeysMiddleware(ctx, next)).resolves.toBeUndefined();

    expect(ctx.keys).toMatchSnapshot();
    expect(ctx.metrics.keystore).toStrictEqual(expect.any(Number));
  });
});
