export type DTOTypes =
  | "UserRegistrationDTO"
  | "UserLoginDTO"
  | "UserUpdateDTO"
  | "ArticleCreationDTO"
  | "ArticleUpdateDTO"
  | "CommentCreationDTO";

export interface UserRegistrationDTO {
  user: {
    username: string;
    email: string;
    password: string;
  };
}

export interface UserLoginDTO {
  user: {
    email: string;
    password: string;
  };
}

export interface UserUpdateDTO {
  /**
   * @minProperties 1
   */
  user: {
    email?: string;
    bio?: string;
    image?: string;
  };
}

export interface ArticleCreationDTO {
  article: {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
  };
}

export interface ArticleUpdateDTO {
  /**
   * @minProperties 1
   */
  article: {
    title?: string;
    description?: string;
    body?: string;
  };
}

export interface CommentCreationDTO {
  comment: {
    body: string;
  };
}
