import MockDate from "mockdate";
import { repositoryKeystoreMiddleware } from "./repository-keystore-middleware";
import { getTestKeyPairEC, getTestKeyPairRSA, getTestRepository, logger } from "../test";

MockDate.set("2020-01-01 08:00:00.000");

const next = jest.fn();

describe("keystoreMiddleware", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      repository: await getTestRepository(),
      logger,
    };

    await ctx.repository.keyPair.create(getTestKeyPairEC());
    await ctx.repository.keyPair.create(getTestKeyPairRSA());
  });

  test("should successfully set keystore on ctx", async () => {
    await expect(
      repositoryKeystoreMiddleware({
        keystoreName: "keystoreName",
      })(ctx, next),
    ).resolves.toBe(undefined);

    expect(ctx.keystore).toMatchSnapshot();
  });
});
