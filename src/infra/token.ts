import jwt from "jsonwebtoken";

export function generateToken(userId: number) {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string);
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as string);
}
