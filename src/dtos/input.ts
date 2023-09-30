export type DTOTypes = "UserRegistrationDTO" | "UserLoginDTO";

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
