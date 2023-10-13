import { Router } from "express";
import validator from "../infra/schema";
import { ErrorDTO } from "../dtos/output";
import db from "../infra/db";
import { User } from "../entities/User";
import { Article } from "../entities/Article";
import { ArticleCreationDTO } from "../dtos/input";

const articleRouter = Router();

// Create article
articleRouter.post("/articles", async (req, res) => {
  const author: User = res.locals.authenticatedUser;

  const v = validator("ArticleCreationDTO");
  if (!v(req.body)) {
    return res.status(422).json(new ErrorDTO(v.errors));
  }

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

  const authenticatedUser: User = res.locals.authenticatedUser;

  return res.status(200).json(await article.toArticleDTO(authenticatedUser));
});

// Update article
articleRouter.put("/articles/:slug", async (req, res) => {
  const article = await db.manager.findOneBy(Article, {
    slug: req.params.slug,
  });
  if (!article) {
    return res.status(404).json(new ErrorDTO("Article not found"));
  }

  const v = validator("ArticleUpdateDTO");
  if (!v(req.body)) {
    return res.status(422).json(new ErrorDTO(v.errors));
  }

  // Update article
  db.manager.merge(Article, article, req.body.article);
  article.setSlug();
  await db.manager.save(article);

  return res.status(200).json(await article.toArticleDTO());
});

export default articleRouter;
