import "./infra/env";
import "reflect-metadata";
import express from "express";
import "express-async-errors";
import bodyParserErrorHandler from "express-body-parser-error-handler";
import cors from "cors";

import db from "./infra/db";
import router from "./routes";
import { authenicateRequest } from "./infra/auth";

db.initialize().then(main).catch(console.error);

function main() {
  const app = express();
  app.use(express.json());
  app.use(bodyParserErrorHandler());
  app.use(cors());

  app.get("/", (req, res) => {
    if (req.query.throwError) {
      throw new Error("Expected error for testing");
    }
    res.send("Hello World!");
  });

  app.use(authenicateRequest);

  app.use("/api", router);

  // Error handler
  app.use((err, _req, res, _next) => {
    console.log(err);
    res.status(500).send("Something broke!");
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server listening at: http://localhost:${process.env.PORT}`);
  });
}
