import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Article } from "./Article";

@Entity()
export class ArticleTag extends BaseEntity {
  @ManyToOne(() => Article, (article) => article.id)
  article: Article;

  @Column()
  tag: string;
}
