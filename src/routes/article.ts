import { Router } from "express";
import { JWTPayload } from "../infra/auth";
import validator from "../infra/schema";
import { ErrorDTO } from "../dtos/output";
import db from "../infra/db";
import { User } from "../entities/User";
import { Article } from "../entities/Article";
import { ArticleCreationDTO } from "../dtos/input";

const articleRouter = Router();

// Create article
articleRouter.post("/articles", async (req, res) => {
  const decodedJWT: JWTPayload = res.locals.decodedJWT;

  const v = validator("ArticleCreationDTO");
  if (!v(req.body)) {
    return res.status(422).json(new ErrorDTO(v.errors));
  }

  const author = await db.manager.findOneBy(User, { id: decodedJWT.userId });

  // Add article
  const article = Article.fromArticleCreationDTO(
    req.body as ArticleCreationDTO,
    author,
  );
  await db.manager.save(article);

  return res.status(200).json(await article.toArticleDTO());
});

// Get article
articleRouter.get("/articles/:slug", async (req, res) => {
  const article = await db.manager.findOneBy(Article, {
    slug: req.params.slug,
  });
  if (!article) {
    return res.status(404).json(new ErrorDTO("Article not found"));
  }

  // Get user if authenticated
  let user = null;
  const decodedJWT: JWTPayload = res.locals.decodedJWT;
  if (decodedJWT) {
    user = await db.manager.findOneBy(User, { id: decodedJWT.userId });
  }

  return res.status(200).json(await article.toArticleDTO(user));
});

export default articleRouter;
