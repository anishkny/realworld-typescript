import { Follow } from "../entities/Follow";
import { User } from "../entities/User";
import db from "../infra/db";

export async function isFollowing(
  user: User,
  targetUser: User,
): Promise<boolean> {
  const follow = await db.manager.findOne(Follow, {
    where: { follower: { id: user.id }, followed: { id: targetUser.id } },
  });

  return !!follow;
}
