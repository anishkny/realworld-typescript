import { ErrorObject } from "ajv";

export class ErrorDTO {
  errors: unknown;

  constructor(errors: ErrorObject[] | string) {
    if (typeof errors === "string") {
      this.errors = { message: errors };
    } else {
      this.errors = {};
      errors.forEach((error) => {
        this.errors[error.instancePath] = error.message;
      });
    }
  }
}

export interface AuthenticatedUserDTO {
  user: {
    email: string;
    token: string;
    username: string;
    bio: string;
    image: string;
  };
}
