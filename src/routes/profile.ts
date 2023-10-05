import { Router } from "express";
import db from "../infra/db";
import { User } from "../entities/User";
import { ErrorDTO } from "../dtos/output";
import { isFollowing } from "../queries/profile";
import { Follow } from "../entities/Follow";

const profileRouter = Router();

// Get profile
profileRouter.get("/profiles/:username", async (req, res) => {
  const { username } = req.params;
  const { decodedJWT: decodedJWT } = res.locals;

  // Find user
  const targetUser = await db.manager.findOne(User, {
    where: { username },
  });
  if (!targetUser) {
    return res.status(404).json(new ErrorDTO("User not found"));
  }

  // Check if following
  let following = false;
  if (decodedJWT) {
    const user = await db.manager.findOneBy(User, { id: decodedJWT.userId });
    following = await isFollowing(user, targetUser);
  }

  return res.status(200).json(User.toProfileDTO(targetUser, following));
});

// Follow user
profileRouter.post("/profiles/:username/follow", async (req, res) => {
  const { username } = req.params;
  const { decodedJWT: decodedJWT } = res.locals;

  // Find user to follow
  const targetUser = await db.manager.findOne(User, {
    where: { username },
  });
  if (!targetUser) {
    return res.status(404).json(new ErrorDTO("User not found"));
  }

  // Follow user (if not already following)
  const user = await db.manager.findOneBy(User, { id: decodedJWT.userId });
  if (!(await isFollowing(user, targetUser))) {
    await db.manager.save(
      Object.assign(new Follow(), { follower: user, followed: targetUser }),
    );
  }

  return res.status(200).json(User.toProfileDTO(targetUser, true));
});

// Unfollow user
profileRouter.delete("/profiles/:username/follow", async (req, res) => {
  const { username } = req.params;
  const { decodedJWT: decodedJWT } = res.locals;

  // Find user to unfollow
  const targetUser = await db.manager.findOne(User, {
    where: { username },
  });
  if (!targetUser) {
    return res.status(404).json(new ErrorDTO("User not found"));
  }

  // Unfollow user
  const user = await db.manager.findOneBy(User, { id: decodedJWT.userId });
  await db.manager.delete(Follow, {
    follower: { id: user.id },
    followed: { id: targetUser.id },
  });

  return res.status(200).json(User.toProfileDTO(targetUser, false));
});

export default profileRouter;
