import { bodyToCreateMission, responseFromMission, responseFromUserMission } from "../dtos/mission.dto.js";
import { findStoreById } from "../repositories/store.repository.js";
import { createMission, findMissionById, isAlreadyChallenging, createUserMissionChallenge } from "../repositories/mission.repository.js";
import { findFirstUserId } from "../repositories/common.repository.js";

export const addMissionToStore = async ({ storeId, body }) => {
  const store = await findStoreById(storeId);
  if (!store) throw new Error("미션을 추가할 가게가 존재하지 않습니다.");

  const payload = bodyToCreateMission(body);
  if (!payload.title) throw new Error("미션 제목(title)은 필수입니다.");

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

export const challengeMission = async ({ missionId }) => {
  const mission = await findMissionById(missionId);
  if (!mission) throw new Error("도전할 미션이 존재하지 않습니다.");

  const userId = await findFirstUserId();
  if (!userId) throw new Error("사용자가 없습니다. 먼저 사용자를 생성하세요.");

  const already = await isAlreadyChallenging({ userId, missionId });
  if (already) throw new Error("이미 도전 중인 미션입니다.");

  const row = await createUserMissionChallenge({ userId, missionId });
  return responseFromUserMission(row);
};
