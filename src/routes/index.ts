import { Router } from "express";
import userRouter from "./user";
import profileRouter from "./profile";

const router = Router();
router.use(userRouter);
router.use(profileRouter);

export default router;
