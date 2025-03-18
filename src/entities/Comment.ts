import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Article } from "./Article";
import { CommentCreationDTO } from "../dtos/input";
import { CommentDTO, CommentInnerDTO, CommentsDTO } from "../dtos/output";
import { isFollowing } from "../queries/profile";

@Entity()
export class Comment extends BaseEntity {
  @Column()
  body: string;

  @ManyToOne(() => Article, (article) => article.id, { onDelete: "CASCADE" })
  article: Article;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
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

  public async toCommentInnerDTO(asUser?: User): Promise<CommentInnerDTO> {
    let following = false;
    if (asUser) {
      following = await isFollowing(asUser, this.author);
    }
    return {
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
    };
  }

  public async toCommentDTO(): Promise<CommentDTO> {
    return {
      comment: await this.toCommentInnerDTO(),
    };
  }

  public static async toCommentsDTO(
    comments: Comment[],
    asUser?: User,
  ): Promise<CommentsDTO> {
    return {
      comments: await Promise.all(
        comments.map((comment) => comment.toCommentInnerDTO(asUser)),
      ),
    };
  }
}
