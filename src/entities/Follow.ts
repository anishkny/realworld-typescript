import { Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";

@Entity()
export class Follow extends BaseEntity {
  @ManyToOne(() => User, (user) => user.id)
  follower: User;

  @ManyToOne(() => User, (user) => user.id)
  followed: User;
}
