import { Column, Entity } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserRegistrationDTO } from "../dtos/input";
import { hashPassword } from "../infra/password";
import { AuthenticatedUserDTO, ProfileDTO } from "../dtos/output";

@Entity()
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  image: string;

  public static fromUserRegistrationDTO(dto: UserRegistrationDTO) {
    const user = new User();
    user.username = dto.user.username;
    user.email = dto.user.email;
    user.passwordHash = hashPassword(dto.user.password);
    return user;
  }

  public static toAuthenticatedUserDTO(
    user: User,
    token: string,
  ): AuthenticatedUserDTO {
    return {
      user: {
        email: user.email,
        token,
        username: user.username,
        bio: user.bio,
        image: user.image,
      },
    };
  }

  public static toProfileDTO(user: User, following: boolean): ProfileDTO {
    return {
      profile: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following,
      },
    };
  }
}
