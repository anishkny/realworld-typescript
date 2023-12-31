import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { ArticleCreationDTO } from "../dtos/input";
import { ArticleDTO } from "../dtos/output";
import slugify from "slugify";
import { ArticleTag } from "./ArticleTag";
import { isFollowing } from "../queries/profile";

@Entity()
export class Article extends BaseEntity {
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  author: User;

  @OneToMany(() => ArticleTag, (articleTag) => articleTag.article, {
    cascade: true,
    eager: true,
  })
  tags: ArticleTag[];

  public static fromArticleCreationDTO(
    articleCreationDTO: ArticleCreationDTO,
    author: User,
  ): Article {
    const article = new Article();
    article.title = articleCreationDTO.article.title;
    article.description = articleCreationDTO.article.description;
    article.body = articleCreationDTO.article.body;
    article.setSlug();
    article.author = author;

    // Add tags if specified
    article.tags =
      articleCreationDTO.article.tagList?.map((tag) => {
        const articleTag = new ArticleTag();
        articleTag.article = article;
        articleTag.tag = tag;
        return articleTag;
      }) ?? [];

    return article;
  }

  public async toArticleDTO(asUser?: User): Promise<ArticleDTO> {
    let following = false;
    if (asUser) {
      following = await isFollowing(asUser, this.author);
    }
    return {
      article: {
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        tagList: this.tags?.map((articleTag) => articleTag.tag),
        createdAt: this.createdAt.toISOString(),
        updatedAt: this.updatedAt.toISOString(),
        favorited: false,
        favoritesCount: 0,
        author: {
          username: this.author.username,
          bio: this.author.bio,
          image: this.author.image,
          following,
        },
      },
    };
  }

  public setSlug() {
    this.slug =
      slugify(this.title, { lower: true, strict: true }) +
      "-" +
      Math.random().toString(36).substring(2);
  }
}
