import * as repo from "../repositories/user.repository.js";
import {
  UserNotFoundError,
  UserMissionNotFoundError,
  AlreadyCompletedError,
} from "../errors.js";

export const listMyReviews = async (userId) => {
  const rows = await repo.findUserReviews(userId);
  if (rows.length === 0) {
    throw new UserNotFoundError(userId);
  }

  return rows.map((r) => ({
    id: r.id,
    content: r.content,
    rating: r.rating,
    store: { id: r.store.id, name: r.store.name },
  }));
};

export const listStoreMissions = async (storeId) => {
  const rows = await repo.findStoreMissions(storeId);
  return rows.map((sm) => ({
    missionId: sm.missionId,
    title: sm.mission.title,
    rewardPoint: sm.mission.rewardPoint,
  }));
};

export const listMyInProgressMissions = async (userId) => {
  const rows = await repo.findInProgressMissions(userId);
  return rows.map((um) => ({
    missionId: um.missionId,
    title: um.mission.title,
    status: um.status,
  }));
};

export const completeMyMission = async (userId, missionId) => {
  const current = await repo.findUserMission(userId, missionId);
  if (!current) throw new UserMissionNotFoundError({ userId, missionId });
  if (current.status === "completed")
    throw new AlreadyCompletedError({ userId, missionId });

  const updated = await repo.completeUserMission(userId, missionId);
  return {
    userId: updated.userId,
    missionId: updated.missionId,
    status: updated.status,
  };
};
