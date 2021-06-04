import { CacheBase, CacheOptions } from "@lindorm-io/redis";
import { KeyPairAttributes, KeyPair } from "@lindorm-io/key-pair";

interface Options extends CacheOptions {
  keystoreName: string;
}

export class KeyPairCache extends CacheBase<KeyPairAttributes, KeyPair> {
  public constructor(options: Options) {
    const entityName = options.keystoreName ? `KeyPair::${options.keystoreName}` : "KeyPair";

    super({
      client: options.client,
      entityName,
      expiresInSeconds: options.expiresInSeconds,
      logger: options.logger,
    });
  }

  protected createEntity(data: KeyPairAttributes): KeyPair {
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

  public async findMany(filter: Partial<KeyPairAttributes>): Promise<Array<KeyPair>> {
    return super.findMany(filter);
  }

  public async remove(entity: KeyPair): Promise<void> {
    await super.remove(entity);
  }
}
