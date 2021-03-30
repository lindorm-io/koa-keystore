import MockDate from "mockdate";
import { CacheEntityNotFoundError } from "@lindorm-io/redis";
import { KeyPair } from "@lindorm-io/key-pair";
import { KeyPairCache } from "./KeyPairCache";
import { getTestCache, inMemoryCache, resetCache } from "../../test";

MockDate.set("2020-01-01 08:00:00.000");

describe("KeyPairCache", () => {
  let cache: KeyPairCache;
  let keyPair: KeyPair;

  beforeEach(async () => {
    ({
      keyPair: { keystoreName: cache },
    } = await getTestCache());
    keyPair = new KeyPair({
      id: "be3a62d1-24a0-401c-96dd-3aff95356811",
      algorithm: "algorithm",
      expires: new Date(),
      passphrase: "passphrase",
      privateKey: "privateKey",
      publicKey: "publicKey",
      type: "type",
    });
  });

  afterEach(resetCache);

  test("should create", async () => {
    await expect(cache.create(keyPair)).resolves.toMatchSnapshot();
    expect(inMemoryCache).toMatchSnapshot();
  });

  test("should update", async () => {
    await cache.create(keyPair);

    await expect(cache.update(keyPair)).resolves.toMatchSnapshot();
    expect(inMemoryCache).toMatchSnapshot();
  });

  test("should find", async () => {
    await cache.create(keyPair);

    await expect(cache.find(keyPair.id)).resolves.toMatchSnapshot();
    expect(inMemoryCache).toMatchSnapshot();
  });

  test("should find many", async () => {
    await cache.create(keyPair);
    await cache.create(
      new KeyPair({
        id: "e1ff05d4-12a5-42c0-9c70-43ead4ccaef6",
        algorithm: "other",
        privateKey: "privateKey",
        publicKey: "publicKey",
        type: "type",
      }),
    );

    await expect(cache.findAll()).resolves.toMatchSnapshot();
    expect(inMemoryCache).toMatchSnapshot();
  });

  test("should remove", async () => {
    await cache.create(keyPair);

    await expect(cache.remove(keyPair)).resolves.toBe(undefined);
    await expect(cache.find(keyPair.id)).rejects.toStrictEqual(expect.any(CacheEntityNotFoundError));
    expect(inMemoryCache).toMatchSnapshot();
  });
});
