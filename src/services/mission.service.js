import prisma from "../db.config.js";
import {
    isMissionAlreadyChallenged,
    startNewChallenge,
    isMissionExist
} from "../repositories/mission.repository.js";
import { isStoreExist } from "../repositories/store.repository.js";
import { ConflictError, NotFoundError } from "../errors/CustomError.js";

export const challengeMission = async (userId, missionId) => {

    const already = await isMissionAlreadyChallenged(userId, missionId);

    const exists = await isMissionExist(missionId); 
    if (!exists) {
        throw new NotFoundError("도전하려는 미션을 찾을 수 없습니다."); 
    }

    if (already) {
        throw new ConflictError("이미 도전 중인 미션입니다.", { internal_code: "M409" });
    }

    const challengeId = await startNewChallenge(userId, missionId);
    return challengeId;
};


export const addMissionToStore = async (storeId, missionData) => {
    const exists = await isStoreExist(storeId);
    if (!exists) {
        throw new NotFoundError("해당 가게를 찾을 수 없습니다.", { internal_code: "M404" });
    }

    const created = await prisma.mission.create({
        data: {
            storeId: Number(storeId),
            title: missionData.title || missionData.name, 
            description: missionData.description ?? null,
            reward: missionData.reward ?? null,
        },
        select: { id: true },
    });

    return created.id;
};
