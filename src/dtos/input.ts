export type DTOTypes = "UserRegistrationDTO" | "UserLoginDTO" | "UserUpdateDTO";

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
