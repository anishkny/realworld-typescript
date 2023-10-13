import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ErrorDTO } from "../dtos/output";
import db from "./db";
import { User } from "../entities/User";

export interface JWTPayload {
  userId: number;
}

export function generateToken(payload: JWTPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET as string);
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
}

export async function authenicateRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization;
  res.locals.token = token;

  if (!token) {
    // If no authorization header, check if route is public
    const allowedUnauthenticated = [
      { method: "POST", path: "/api/users" },
      { method: "POST", path: "/api/users/login" },
      { method: "GET", path: "/api/profiles" },
      { method: "GET", path: "/api/articles" },
    ];
    const reqPathLowerCase = req.path.toLowerCase();
    const reqMethodUpperCase = req.method.toUpperCase();
    const isAllowedUnauthenticated = allowedUnauthenticated.some(
      (route) =>
        reqMethodUpperCase === route.method &&
        reqPathLowerCase.startsWith(route.path),
    );
    if (isAllowedUnauthenticated) {
      return next();
    }
    return res.status(401).json(new ErrorDTO("Unauthorized"));
  }

  try {
    const decodedJWT = verifyToken(token);
    const user = await db.manager.findOneBy(User, { id: decodedJWT.userId });
    // istanbul ignore next
    if (!user) return res.status(401).json(new ErrorDTO("Unauthorized"));
    res.locals.authenticatedUser = user;
    next();
  } catch (err) {
    return res.status(401).json(new ErrorDTO("Unauthorized"));
  }
}
