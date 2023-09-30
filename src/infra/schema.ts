import { readFileSync } from "fs";
import Ajv from "ajv";
import { DTOTypes } from "../dtos/input";

const ajv = new Ajv({ allErrors: true, strict: false });
const generatedSchemas = JSON.parse(
  readFileSync("./generated-schemas.json", "utf8"),
);
ajv.addSchema(generatedSchemas);

export default function validator(schema: DTOTypes) {
  if (!ajv.getSchema(`#/definitions/${schema}`)) {
    throw new Error(`Schema ${schema} does not exist`);
  }
  return ajv.getSchema(`#/definitions/${schema}`);
}
