import dotEnvExtended from "dotenv-extended";
dotEnvExtended.load({ errorOnMissing: true });
import "reflect-metadata";

import { db } from "./infra/db";

db.initialize().then(main).catch(console.error);

function main() {
  console.log("Connected to database!");
}
