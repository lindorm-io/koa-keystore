import MockDate from "mockdate";
import { EntityNotFoundError } from "@lindorm-io/entity";
import { KeyPair, KeyType } from "@lindorm-io/key-pair";
import { KeyPairRepository } from "./KeyPairRepository";
import { getTestKeyPairEC, getTestRepository, inMemoryStore, resetStore } from "../test";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("KeyPairRepository", () => {
  let repository: KeyPairRepository;
  let keyPair: KeyPair;

  beforeEach(async () => {
    ({ keyPairRepository: repository } = await getTestRepository());
    keyPair = getTestKeyPairEC();
  });

  afterEach(resetStore);

  test("should create", async () => {
    await expect(repository.create(keyPair)).resolves.toStrictEqual(expect.any(KeyPair));
    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should update", async () => {
    await repository.create(keyPair);

    keyPair.expires = new Date("2020-01-01T10:00:00.000Z");

    await expect(repository.update(keyPair)).resolves.toStrictEqual(expect.any(KeyPair));
    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should find", async () => {
    await repository.create(keyPair);

    await expect(repository.find({ type: KeyType.EC })).resolves.toMatchSnapshot();
  });

  test("should find many", async () => {
    await repository.create(keyPair);
    await repository.create(getTestKeyPairEC());

    await expect(repository.findMany({ type: KeyType.EC })).resolves.toMatchSnapshot();
  });

  test("should remove", async () => {
    await repository.create(keyPair);

    await expect(repository.remove(keyPair)).resolves.toBeUndefined();
    await expect(repository.find({ id: keyPair.id })).rejects.toThrow(
      EntityNotFoundError,
    );
    expect(inMemoryStore).toMatchSnapshot();
  });
});
