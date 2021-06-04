import MockDate from "mockdate";
import { repositoryKeystoreMiddleware } from "./repository-keystore-middleware";
import { getTestKeyPairEC, getTestKeyPairRSA, getTestRepository, logger } from "../test";

MockDate.set("2020-01-01T08:00:00.000Z");

const next = jest.fn();

describe("repositoryKeystoreMiddleware", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      keystore: {},
      logger,
      metrics: {},
      repository: await getTestRepository(),
    };

    await ctx.repository.keyPairRepository.create(getTestKeyPairEC());
    await ctx.repository.keyPairRepository.create(getTestKeyPairRSA());
  });

  test("should successfully set keystore on ctx", async () => {
    await expect(
      repositoryKeystoreMiddleware({
        keystoreName: "keystoreName",
      })(ctx, next),
    ).resolves.toBeUndefined();

    expect(ctx.keystore).toMatchSnapshot();
    expect(ctx.metrics.keystore).toStrictEqual(expect.any(Number));
  });
});
