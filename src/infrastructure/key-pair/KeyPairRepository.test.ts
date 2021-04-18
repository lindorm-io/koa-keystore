import MockDate from "mockdate";
import { KeyPair } from "@lindorm-io/key-pair";
import { KeyPairRepository } from "./KeyPairRepository";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { getTestRepository, inMemoryStore, resetStore } from "../../test";

MockDate.set("2020-01-01 08:00:00.000");

describe("KeyPairRepository", () => {
  let repository: KeyPairRepository;
  let keyPair: KeyPair;

  beforeEach(async () => {
    ({ keyPairRepository: repository } = await getTestRepository());
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

  afterEach(resetStore);

  test("should create", async () => {
    await expect(repository.create(keyPair)).resolves.toMatchSnapshot();
    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should update", async () => {
    await repository.create(keyPair);

    await expect(repository.update(keyPair)).resolves.toMatchSnapshot();
    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should find", async () => {
    await repository.create(keyPair);

    await expect(repository.find({ type: "type" })).resolves.toMatchSnapshot();
    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should find many", async () => {
    await repository.create(keyPair);
    await repository.create(
      new KeyPair({
        id: "e1ff05d4-12a5-42c0-9c70-43ead4ccaef6",
        algorithm: "other",
        privateKey: "privateKey",
        publicKey: "publicKey",
        type: "type",
      }),
    );

    await expect(repository.findMany({ type: "type" })).resolves.toMatchSnapshot();
    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should remove", async () => {
    await repository.create(keyPair);

    await expect(repository.remove(keyPair)).resolves.toBe(undefined);
    await expect(repository.find({ id: keyPair.id })).rejects.toStrictEqual(expect.any(RepositoryEntityNotFoundError));
    expect(inMemoryStore).toMatchSnapshot();
  });
});
