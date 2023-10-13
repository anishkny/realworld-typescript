import { Router } from "express";
import userRouter from "./user";
import profileRouter from "./profile";
import articleRouter from "./article";

const router = Router();
router.use(userRouter);
router.use(profileRouter);
router.use(articleRouter);

export default router;
