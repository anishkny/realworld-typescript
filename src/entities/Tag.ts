import { Column, Entity } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Tag extends BaseEntity {
  @Column()
  name: string;
}
