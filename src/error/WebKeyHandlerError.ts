import { ExtendableError } from "@lindorm-io/errors";

export class WebKeyHandlerError extends ExtendableError {
  constructor(error: Error) {
    super("Unable to find JWKS on URL", {
      debug: { error },
    });
  }
}
