import { KeyPairAttributes, KeyPair } from "@lindorm-io/key-pair";
import { RepositoryOptions, RepositoryBase } from "@lindorm-io/mongo";

export class KeyPairRepository extends RepositoryBase<KeyPairAttributes, KeyPair> {
  public constructor(options: RepositoryOptions) {
    super({
      collectionName: "key_pair",
      db: options.db,
      logger: options.logger,
      indices: [
        {
          index: { id: 1 },
          options: { unique: true },
        },
      ],
    });
  }

  protected createEntity(data: KeyPairAttributes): KeyPair {
    return new KeyPair(data);
  }
}
