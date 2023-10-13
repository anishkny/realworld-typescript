import { Router } from "express";
import db from "../infra/db";
import { User } from "../entities/User";
import { ErrorDTO } from "../dtos/output";
import { isFollowing } from "../queries/profile";
import { Follow } from "../entities/Follow";

const profileRouter = Router();

// Get profile
profileRouter.get("/profiles/:username", async (req, res) => {
  const targetUsername = req.params.username;
  const authenticatedUser: User = res.locals.authenticatedUser;

  // Find user
  const targetUser = await db.manager.findOne(User, {
    where: { username: targetUsername },
  });
  if (!targetUser) {
    return res.status(404).json(new ErrorDTO("User not found"));
  }

  // Check if following
  let following = false;
  if (authenticatedUser) {
    following = await isFollowing(authenticatedUser, targetUser);
  }

  return res.status(200).json(targetUser.toProfileDTO(following));
});

// Follow user
profileRouter.post("/profiles/:username/follow", async (req, res) => {
  const targetUsername = req.params.username;
  const authenticatedUser: User = res.locals.authenticatedUser;

  // Find user to follow
  const targetUser = await db.manager.findOne(User, {
    where: { username: targetUsername },
  });
  if (!targetUser) {
    return res.status(404).json(new ErrorDTO("User not found"));
  }

  // Follow user (if not already following)
  if (!(await isFollowing(authenticatedUser, targetUser))) {
    await db.manager.save(
      Object.assign(new Follow(), {
        follower: authenticatedUser,
        followed: targetUser,
      }),
    );
  }

  return res.status(200).json(targetUser.toProfileDTO(true));
});

// Unfollow user
profileRouter.delete("/profiles/:username/follow", async (req, res) => {
  const targetUsername = req.params.username;
  const authenticatedUser: User = res.locals.authenticatedUser;

  // Find user to unfollow
  const targetUser = await db.manager.findOne(User, {
    where: { username: targetUsername },
  });
  if (!targetUser) {
    return res.status(404).json(new ErrorDTO("User not found"));
  }

  // Unfollow user
  await db.manager.delete(Follow, {
    follower: { id: authenticatedUser.id },
    followed: { id: targetUser.id },
  });

  return res.status(200).json(targetUser.toProfileDTO(false));
});

export default profileRouter;
