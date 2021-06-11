import MockDate from "mockdate";
import { EntityNotFoundError } from "@lindorm-io/redis";
import { KeyPair } from "@lindorm-io/key-pair";
import { KeyPairCache } from "./KeyPairCache";
import { getTestCache, getTestKeyPairEC, getTestKeyPairRSA, inMemoryCache, resetCache } from "../test";

MockDate.set("2020-01-01T08:00:00.000Z");

describe("KeyPairCache", () => {
  let keyPairCache: KeyPairCache;
  let keyPair: KeyPair;

  beforeEach(async () => {
    ({ keyPairCache } = await getTestCache());

    keyPair = getTestKeyPairEC();
  });

  afterEach(resetCache);

  test("should create", async () => {
    await expect(keyPairCache.create(keyPair)).resolves.toStrictEqual(expect.any(KeyPair));
    expect(inMemoryCache).toMatchSnapshot();
  });

  test("should update", async () => {
    await keyPairCache.create(keyPair);

    keyPair.expires = new Date("2099-01-01T08:00:00.000Z");

    await expect(keyPairCache.update(keyPair)).resolves.toStrictEqual(expect.any(KeyPair));
    expect(inMemoryCache).toMatchSnapshot();
  });

  test("should find", async () => {
    await keyPairCache.create(keyPair);

    await expect(keyPairCache.find(keyPair.id)).resolves.toMatchSnapshot();
  });

  test("should find many", async () => {
    await keyPairCache.create(keyPair);
    await keyPairCache.create(getTestKeyPairRSA());

    await expect(keyPairCache.findAll()).resolves.toMatchSnapshot();
  });

  test("should remove", async () => {
    await keyPairCache.create(keyPair);

    await expect(keyPairCache.remove(keyPair)).resolves.toBeUndefined();
    await expect(keyPairCache.find(keyPair.id)).rejects.toThrow(EntityNotFoundError);
    expect(inMemoryCache).toMatchSnapshot();
  });
});
