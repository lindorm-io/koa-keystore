import { IKeyPairAttributes, IKeyPairOptions, KeyPair } from "@lindorm-io/key-pair";
import { IRepositoryOptions, RepositoryBase } from "@lindorm-io/mongo";
import { indices } from "./indices";

export class KeyPairRepository extends RepositoryBase<IKeyPairAttributes, KeyPair> {
  public constructor(options: IRepositoryOptions) {
    super({
      collectionName: "key_pair",
      db: options.db,
      logger: options.logger,
      indices,
    });
  }

  protected createEntity(data: IKeyPairAttributes): KeyPair {
    return new KeyPair(data);
  }

  public async create(entity: KeyPair): Promise<KeyPair> {
    return super.create(entity);
  }

  public async update(entity: KeyPair): Promise<KeyPair> {
    return super.update(entity);
  }

  public async find(filter: Partial<IKeyPairAttributes>): Promise<KeyPair> {
    return super.find(filter);
  }

  public async findMany(filter: Partial<IKeyPairAttributes>): Promise<Array<KeyPair>> {
    return super.findMany(filter);
  }

  public async findOrCreate(filter: Partial<IKeyPairOptions>): Promise<KeyPair> {
    return super.findOrCreate(filter);
  }

  public async remove(entity: KeyPair): Promise<void> {
    await super.remove(entity);
  }

  public async removeMany(filter: Partial<IKeyPairAttributes>): Promise<void> {
    await super.removeMany(filter);
  }
}
