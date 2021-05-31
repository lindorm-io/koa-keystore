import { CacheBase, ICacheOptions } from "@lindorm-io/redis";
import { IKeyPairAttributes, KeyPair } from "@lindorm-io/key-pair";

interface IOptions extends ICacheOptions {
  keystoreName: string;
}

export class KeyPairCache extends CacheBase<IKeyPairAttributes, KeyPair> {
  constructor(options: IOptions) {
    const entityName = options.keystoreName ? `KeyPair::${options.keystoreName}` : "KeyPair";

    super({
      client: options.client,
      entityName,
      expiresInSeconds: options.expiresInSeconds,
      logger: options.logger,
    });
  }

  protected createEntity(data: IKeyPairAttributes): KeyPair {
    return new KeyPair(data);
  }

  public async create(entity: KeyPair, expiresInSeconds?: number): Promise<KeyPair> {
    return super.create(entity, expiresInSeconds);
  }

  public async update(entity: KeyPair): Promise<KeyPair> {
    return super.update(entity);
  }

  public async find(id: string): Promise<KeyPair> {
    return super.find(id);
  }

  public async findAll(): Promise<Array<KeyPair>> {
    return super.findAll();
  }

  public async findMany(filter: Partial<IKeyPairAttributes>): Promise<Array<KeyPair>> {
    return super.findMany(filter);
  }

  public async remove(entity: KeyPair): Promise<void> {
    await super.remove(entity);
  }
}
