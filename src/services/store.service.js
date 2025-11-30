import * as repo from "../repositories/store.repository.js";
import {
  RegionNotFoundError,
  StoreNotFoundError,
  UserNotFoundError,
  MissionNotFoundError,
  AlreadyLinkedMissionError,
  AlreadyChallengingError,
  ValidationError,
} from "../errors.js";

// 1-1
export const createStore = async ({ regionId, name, address }) => {
  if (!name) throw new ValidationError("가게 이름이 필요합니다.", { name });

  if (!(await repo.existsRegion(regionId)))
    throw new RegionNotFoundError(regionId);

  const id = await repo.insertStore({ regionId, name, address });
  return { storeId: id, regionId, name, address };
};

// 1-2
export const createReview = async ({ storeId, userId, content, rating }) => {
  if (!(await repo.existsStore(storeId))) throw new StoreNotFoundError(storeId);
  if (!(await repo.existsUser(userId))) throw new UserNotFoundError(userId);
  if (rating < 1 || rating > 5)
    throw new ValidationError("평점은 1~5 사이여야 합니다.", { rating });

  const id = await repo.insertReview({ storeId, userId, content, rating });
  return { reviewId: id, storeId, userId, rating };
};

// 1-3
export const linkMission = async ({ storeId, missionId }) => {
  if (!(await repo.existsStore(storeId))) throw new StoreNotFoundError(storeId);
  if (!(await repo.existsMission(missionId)))
    throw new MissionNotFoundError(missionId);
  if (await repo.existsStoreMission(storeId, missionId))
    throw new AlreadyLinkedMissionError({ storeId, missionId });

  const id = await repo.insertStoreMission({ storeId, missionId });
  return { linkId: id, storeId, missionId };
};

// 1-4
export const challengeMission = async ({ missionId, userId }) => {
  if (!(await repo.existsMission(missionId)))
    throw new MissionNotFoundError(missionId);
  if (!(await repo.existsUser(userId))) throw new UserNotFoundError(userId);
  if (await repo.existsUserMission(userId, missionId))
    throw new AlreadyChallengingError({ userId, missionId });

  const id = await repo.insertUserMission({ userId, missionId });
  return { userMissionId: id, userId, missionId, status: "in_progress" };
};
