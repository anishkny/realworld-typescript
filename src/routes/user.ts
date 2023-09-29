import { Router } from "express";
import validator from "../infra/schema";
import { User } from "../entities/User";
import { UserRegistrationDTO } from "../dtos/input";
import db from "../infra/db";

const userRouter = Router();

userRouter.post("/users", async (req, res) => {
  const v = validator("UserRegistrationDTO");
  if (!v(req.body)) {
    return res.status(422).json(v.errors);
  }

  // Add user
  const user = User.fromUserRegistrationDTO(req.body as UserRegistrationDTO);
  await db.manager.save(user);

  // Return user
  return res.status(200).json(User.toAuthenticatedUserDTO(user, "token"));
});

export default userRouter;
