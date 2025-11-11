import prisma from "../db.config.js";
import {
    isMissionAlreadyChallenged,
    startNewChallenge,
} from "../repositories/mission.repository.js";
import { isStoreExist } from "../repositories/store.repository.js";

/**
 * 사용자가 미션에 도전하기
 * (이미 도전 중이면 M409 에러)
 */
export const challengeMission = async (userId, missionId) => {
    // 1️⃣ 이미 도전 중인지 확인
    const already = await isMissionAlreadyChallenged(userId, missionId);
    if (already) {
        const err = new Error("M409: 이미 도전 중인 미션입니다.");
        throw err;
    }

    // 2️⃣ 새 도전 등록
    const challengeId = await startNewChallenge(userId, missionId);
    return challengeId;
};

/**
 * 특정 가게에 미션 추가
 * (가게 존재 여부 확인 후 생성)
 */
export const addMissionToStore = async (storeId, missionData) => {
    const exists = await isStoreExist(storeId);
    if (!exists) {
        const err = new Error("M404: store not found");
        throw err;
    }

    const created = await prisma.mission.create({
        data: {
            storeId: Number(storeId),
            title: missionData.title || missionData.name, // 이름 필드 둘 다 지원
            description: missionData.description ?? null,
            reward: missionData.reward ?? null,
        },
        select: { id: true },
    });

    return created.id;
};
