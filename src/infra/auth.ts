import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ErrorDTO } from "../dtos/output";

export interface JWTPayload {
  userId: number;
}

export function generateToken(payload: JWTPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET as string);
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
}

export function authenicateRequest(
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
    ];
    const isAllowedUnauthenticated = allowedUnauthenticated.some(
      (route) =>
        route.method === req.method &&
        route.path.startsWith(req.path.toLowerCase()),
    );
    if (isAllowedUnauthenticated) {
      return next();
    }
    return res.status(401).json(new ErrorDTO("Unauthorized"));
  }

  try {
    res.locals.decodedJWT = verifyToken(token);
    next();
  } catch (err) {
    return res.status(401).json(new ErrorDTO("Unauthorized"));
  }
}
