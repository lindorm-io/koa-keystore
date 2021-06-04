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

  public async create(entity: KeyPair): Promise<KeyPair> {
    return super.create(entity);
  }

  public async update(entity: KeyPair): Promise<KeyPair> {
    return super.update(entity);
  }

  public async find(filter: Partial<KeyPairAttributes>): Promise<KeyPair> {
    return super.find(filter);
  }

  public async findMany(filter: Partial<KeyPairAttributes>): Promise<Array<KeyPair>> {
    return super.findMany(filter);
  }

  public async findOrCreate(filter: Partial<KeyPairAttributes>): Promise<KeyPair> {
    return super.findOrCreate(filter);
  }

  public async remove(entity: KeyPair): Promise<void> {
    await super.remove(entity);
  }

  public async removeMany(filter: Partial<KeyPairAttributes>): Promise<void> {
    await super.removeMany(filter);
  }
}
