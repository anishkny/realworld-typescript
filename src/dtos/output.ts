import { ErrorObject } from "ajv";

export class ErrorDTO {
  errors: unknown;

  constructor(errors: ErrorObject[] | string) {
    if (typeof errors === "string") {
      this.errors = { message: [errors] };
    } else {
      this.errors = {};
      errors.forEach((error) => {
        this.errors[error.instancePath] = this.errors[error.instancePath]
          ? [...this.errors[error.instancePath], error.message]
          : [error.message];
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

export interface ProfileDTO {
  profile: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
}

export interface ArticleDTO {
  article: {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    createdAt: string;
    updatedAt: string;
    favorited: boolean;
    favoritesCount: number;
    author: {
      username: string;
      bio: string;
      image: string;
      following: boolean;
    };
  };
}
