import "./infra/env";
import "reflect-metadata";
import express from "express";
import "express-async-errors";

import db from "./infra/db";
import router from "./routes";
import { authenicateRequest } from "./infra/auth";

db.initialize().then(main).catch(console.error);

function main() {
  const app = express();
  app.use(express.json());
  app.use(authenicateRequest);

  app.use("/api", router);

  app.use((err, req, res, _next) => {
    console.log(err);
    if (!res.headersSent) {
      res.status(500).send("Something broke!");
    }
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server listening at: http://localhost:${process.env.PORT}`);
  });
}
