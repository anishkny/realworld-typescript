import { Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Article } from "./Article";
import { Tag } from "./Tag";

@Entity()
export class ArticleTag extends BaseEntity {
  @ManyToOne(() => Article, (article) => article.id)
  article: Article;

  @ManyToOne(() => Tag, (tag) => tag.id)
  tag: Tag;
}
