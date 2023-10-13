import { Router } from "express";
import validator from "../infra/schema";
import { User } from "../entities/User";
import { UserRegistrationDTO } from "../dtos/input";
import { ErrorDTO } from "../dtos/output";
import db from "../infra/db";
import { generateToken } from "../infra/auth";
import { comparePassword } from "../infra/password";

const userRouter = Router();

// Regsiter user
userRouter.post("/users", async (req, res) => {
  const v = validator("UserRegistrationDTO");
  if (!v(req.body)) {
    return res.status(422).json(new ErrorDTO(v.errors));
  }

  // Add user
  const user = User.fromUserRegistrationDTO(req.body as UserRegistrationDTO);
  await db.manager.save(user);

  // Return user
  const token = generateToken({ userId: user.id });
  return res.status(200).json(user.toAuthenticatedUserDTO(token));
});

// Login user
userRouter.post("/users/login", async (req, res) => {
  const v = validator("UserLoginDTO");
  if (!v(req.body)) {
    return res.status(422).json(new ErrorDTO(v.errors));
  }

  // Find user
  const user = await db.manager.findOne(User, {
    where: { email: req.body.user.email },
  });
  if (!user) {
    return res.status(404).json(new ErrorDTO("User not found"));
  }

  // Check password
  if (!comparePassword(req.body.user.password, user.passwordHash)) {
    return res.status(401).json(new ErrorDTO("Invalid password"));
  }

  // Return user
  const token = generateToken({ userId: user.id });
  return res.status(200).json(user.toAuthenticatedUserDTO(token));
});

// Get user
userRouter.get("/user", async (_req, res) => {
  const user: User = res.locals.authenticatedUser;
  const token: string = res.locals.token;
  return res.status(200).json(user.toAuthenticatedUserDTO(token));
});

// Update user
userRouter.put("/user", async (req, res) => {
  const user: User = res.locals.authenticatedUser;
  const token: string = res.locals.token;

  const v = validator("UserUpdateDTO");
  if (!v(req.body)) {
    return res.status(422).json(new ErrorDTO(v.errors));
  }

  // Update user
  db.manager.merge(User, user, req.body.user);
  await db.manager.save(user);

  // Return user
  return res.status(200).json(user.toAuthenticatedUserDTO(token));
});

export default userRouter;
