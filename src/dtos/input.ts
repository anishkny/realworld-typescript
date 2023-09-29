export type DTOTypes = "UserRegistrationDTO";

export interface UserRegistrationDTO {
  user: {
    username: string;
    email: string;
    password: string;
  };
}
