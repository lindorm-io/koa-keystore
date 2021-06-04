import { Axios } from "@lindorm-io/axios";
import { JWK } from "@lindorm-io/key-pair";
import { KeyPair } from "@lindorm-io/key-pair";
import { Logger } from "@lindorm-io/winston";
import { WebKeyHandlerError } from "../error";

interface IWebKeyHandlerOptions {
  baseUrl: string;
  logger: Logger;
  name: string;
}

interface AxiosResponse {
  keys: Array<JWK>;
}

export class WebKeyHandler {
  private readonly axios: Axios;
  private readonly logger: Logger;

  public constructor(options: IWebKeyHandlerOptions) {
    this.logger = options.logger.createChildLogger(["WebKeyHandler"]);
    this.axios = new Axios({
      baseUrl: options.baseUrl,
      logger: this.logger,
      name: options.name,
    });
  }

  public async getKeys(): Promise<Array<KeyPair>> {
    const start = Date.now();

    try {
      const response = await this.axios.get<AxiosResponse>("/.well-known/jwks.json");
      const keys = response?.data?.keys;

      if (!keys || !keys.length) {
        throw new Error("No keys could be found");
      }

      const array: Array<KeyPair> = [];

      for (const key of keys) {
        array.push(KeyPair.fromJWK(key));
      }

      this.logger.debug("found keys from host", {
        result: { success: !!keys.length, amount: keys.length },
        time: Date.now() - start,
      });

      return array;
    } catch (err) {
      throw new WebKeyHandlerError(err);
    }
  }
}
