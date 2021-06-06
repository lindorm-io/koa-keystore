import { CacheBase, CacheOptions } from "@lindorm-io/redis";
import { KeyPairAttributes, KeyPair } from "@lindorm-io/key-pair";

export class KeyPairCache extends CacheBase<KeyPairAttributes, KeyPair> {
  public constructor(options: CacheOptions) {
    super({
      client: options.client,
      entityName: "KeyPair",
      expiresInSeconds: options.expiresInSeconds,
      logger: options.logger,
    });
  }

  protected createEntity(data: KeyPairAttributes): KeyPair {
    return new KeyPair(data);
  }
}
