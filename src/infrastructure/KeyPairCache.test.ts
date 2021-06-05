import MockDate from "mockdate";
import { CacheEntityNotFoundError } from "@lindorm-io/redis";
import { KeyPair } from "@lindorm-io/key-pair";
import { KeyPairCache } from "./KeyPairCache";
import { getTestCache, getTestKeyPairEC, getTestKeyPairRSA, inMemoryCache, resetCache } from "../test";

MockDate.set("2020-01-01T08:00:00.000Z");

describe("KeyPairCache", () => {
  let cache: KeyPairCache;
  let keyPair: KeyPair;

  beforeEach(async () => {
    ({
      keyPair: { keystoreName: cache },
    } = await getTestCache());
    keyPair = getTestKeyPairEC();
  });

  afterEach(resetCache);

  test("should create", async () => {
    await expect(cache.create(keyPair)).resolves.toStrictEqual(expect.any(KeyPair));
    expect(inMemoryCache).toMatchSnapshot();
  });

  test("should update", async () => {
    await cache.create(keyPair);

    keyPair.expires = new Date("2099-01-01T08:00:00.000Z");

    await expect(cache.update(keyPair)).resolves.toStrictEqual(expect.any(KeyPair));
    expect(inMemoryCache).toMatchSnapshot();
  });

  test("should find", async () => {
    await cache.create(keyPair);

    await expect(cache.find(keyPair.id)).resolves.toMatchSnapshot();
  });

  test("should find many", async () => {
    await cache.create(keyPair);
    await cache.create(getTestKeyPairRSA());

    await expect(cache.findAll()).resolves.toMatchSnapshot();
  });

  test("should remove", async () => {
    await cache.create(keyPair);

    await expect(cache.remove(keyPair)).resolves.toBeUndefined();
    await expect(cache.find(keyPair.id)).rejects.toStrictEqual(expect.any(CacheEntityNotFoundError));
    expect(inMemoryCache).toMatchSnapshot();
  });
});
