import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Article } from "./Article";
import { CommentCreationDTO } from "../dtos/input";
import { CommentDTO } from "../dtos/output";
import { isFollowing } from "../queries/profile";

@Entity()
export class Comment extends BaseEntity {
  @Column()
  body: string;

  @ManyToOne(() => Article, (article) => article.id, { onDelete: "CASCADE" })
  article: Article;

  @ManyToOne(() => User, (user) => user.id)
  author: User;

  static fromCommentCreationDTO(
    commentCreationDTO: CommentCreationDTO,
    author: User,
    article: Article,
  ): Comment {
    const newComment = new Comment();
    newComment.body = commentCreationDTO.comment.body;
    newComment.author = author;
    newComment.article = article;
    return newComment;
  }

  public async toCommentDTO(asUser?: User): Promise<CommentDTO> {
    let following = false;
    // istanbul ignore next: TODO: remove this after adding get comments
    if (asUser) {
      following = await isFollowing(asUser, this.author);
    }
    return {
      comment: {
        id: this.id,
        createdAt: this.createdAt.toISOString(),
        updatedAt: this.updatedAt.toISOString(),
        body: this.body,
        author: {
          username: this.author.username,
          bio: this.author.bio,
          image: this.author.image,
          following,
        },
      },
    };
  }
}
