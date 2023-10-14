import { Router } from "express";
import validator from "../infra/schema";
import { ErrorDTO } from "../dtos/output";
import { User } from "../entities/User";
import { Article } from "../entities/Article";
import { Comment } from "../entities/Comment";
import db from "../infra/db";
import { CommentCreationDTO } from "../dtos/input";

const commentRouter = Router();

// Create comment
commentRouter.post("/articles/:slug/comments", async (req, res) => {
  const author: User = res.locals.authenticatedUser;

  const v = validator("CommentCreationDTO");
  if (!v(req.body)) {
    return res.status(422).json(new ErrorDTO(v.errors));
  }

  // Find article
  const article = await db.manager.findOneBy(Article, {
    slug: req.params.slug,
  });
  if (!article) {
    return res.status(404).json(new ErrorDTO("Article not found"));
  }

  // Add comment
  const comment = Comment.fromCommentCreationDTO(
    req.body as CommentCreationDTO,
    author,
    article,
  );
  await db.manager.save(comment);

  return res.status(200).json(await comment.toCommentDTO());
});

export default commentRouter;
