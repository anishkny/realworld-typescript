import { Router } from "express";
import userRouter from "./user";
import profileRouter from "./profile";
import articleRouter from "./article";
import commentRouter from "./comment";

const router = Router();
router.use(userRouter);
router.use(profileRouter);
router.use(articleRouter);
router.use(commentRouter);

export default router;
