import * as repo from "../repositories/store.repository.js";

// 1-1
export const createStore = async ({ regionId, name, address }) => {
  if (!name) throw new Error("가게 이름이 필요합니다.");
  const exists = await repo.existsRegion(regionId);
  if (!exists) throw new Error("해당 지역이 존재하지 않습니다.");
  const id = await repo.insertStore({ regionId, name, address });
  return { storeId: id, regionId, name, address };
};

// 1-2
export const createReview = async ({ storeId, userId, content, rating }) => {
  if (!(await repo.existsStore(storeId)))
    throw new Error("가게가 존재하지 않습니다.");
  if (!(await repo.existsUser(userId)))
    throw new Error("사용자가 존재하지 않습니다.");
  if (rating < 1 || rating > 5) throw new Error("평점은 1~5 사이여야 합니다.");
  const id = await repo.insertReview({ storeId, userId, content, rating });
  return { reviewId: id, storeId, userId, rating };
};

// 1-3
export const linkMission = async ({ storeId, missionId }) => {
  if (!(await repo.existsStore(storeId)))
    throw new Error("가게가 존재하지 않습니다.");
  if (!(await repo.existsMission(missionId)))
    throw new Error("미션이 존재하지 않습니다.");
  if (await repo.existsStoreMission(storeId, missionId))
    throw new Error("이미 연결된 미션입니다.");
  const id = await repo.insertStoreMission({ storeId, missionId });
  return { linkId: id, storeId, missionId };
};

// 1-4
export const challengeMission = async ({ missionId, userId }) => {
  if (!(await repo.existsMission(missionId)))
    throw new Error("미션이 존재하지 않습니다.");
  if (!(await repo.existsUser(userId)))
    throw new Error("사용자가 존재하지 않습니다.");
  if (await repo.existsUserMission(userId, missionId))
    throw new Error("이미 도전 중입니다.");
  const id = await repo.insertUserMission({ userId, missionId });
  return { userMissionId: id, userId, missionId, status: "in_progress" };
};
