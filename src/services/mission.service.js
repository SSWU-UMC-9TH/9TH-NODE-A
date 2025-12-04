import { bodyToCreateMission, responseFromMission, responseFromUserMission } from "../dtos/mission.dto.js";
import { findStoreById } from "../repositories/store.repository.js";
import {
  createMission,
  findMissionById,
  isAlreadyChallenging,
  createUserMissionChallenge,
  getMissionsByStore,
  getMyChallengingMissions,
  completeMyChallenge,
} from "../repositories/mission.repository.js";
import {
  ValidationError,
  NotFoundError,
  MissingUserError,
  AlreadyChallengingError,
} from "../errors.js";

export const addMissionToStore = async ({ storeId, body }) => {
  const store = await findStoreById(storeId);
  if (!store) throw new NotFoundError("미션을 추가할 가게가 존재하지 않습니다.", { storeId });

  const payload = bodyToCreateMission(body);
  if (!payload.title) throw new ValidationError("미션 제목(title)은 필수입니다.", { field: "title" });

  const row = await createMission({
    storeId,
    title: payload.title,
    description: payload.description,
    rewardPoints: payload.rewardPoints,
    startDate: payload.startDate,
    endDate: payload.endDate,
    isActive: payload.isActive,
  });
  return responseFromMission(row);
};

export const challengeMission = async ({ missionId, userId }) => {
  const mission = await findMissionById(missionId);
  if (!mission) throw new NotFoundError("도전할 미션이 존재하지 않습니다.", { missionId });

  if (!userId) throw new MissingUserError();

  const already = await isAlreadyChallenging({ userId, missionId });
  if (already) throw new AlreadyChallengingError("이미 도전 중인 미션입니다.", { missionId, userId });

  const row = await createUserMissionChallenge({ userId, missionId });
  return responseFromUserMission(row);
};

export const listStoreMissions = async (storeId, onlyActive = null, cursor = 0, take = 5) => {
  const store = await findStoreById(storeId);
  if (!store) throw new NotFoundError("가게가 존재하지 않습니다.", { storeId });

  const rows = await getMissionsByStore(storeId, onlyActive, cursor, take);
  return { data: rows, pagination: { cursor: rows.length ? rows[rows.length - 1].id : null } };
};

export const listMyChallengingMissions = async (cursor = 0, take = 5, userId) => {
  if (!userId) throw new MissingUserError();

  const rows = await getMyChallengingMissions(userId, cursor, take);
  return { data: rows, pagination: { cursor: rows.length ? rows[rows.length - 1].id : null } };
};

export const completeMyMission = async ({ missionId, userId }) => {
  if (!userId) throw new MissingUserError();

  const updated = await completeMyChallenge(userId, missionId);
  if (!updated) throw new NotFoundError("진행 중인 미션이 아니거나 존재하지 않습니다.", { missionId, userId });
  return updated;
};
