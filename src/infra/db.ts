import "./env";
import { DataSource } from "typeorm";

const POSTGRES_URI = process.env.POSTGRES_URI;

export const db = new DataSource({
  type: "postgres",
  url: POSTGRES_URI,
  entities: ["dist/entities/**/*.js"],
  migrations: ["dist/migrations/**/*.js"],
  migrationsRun: true,
});
