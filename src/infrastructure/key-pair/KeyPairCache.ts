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
}
