import prisma from "../db.config.js";

/**
 * 사용자가 이미 해당 미션을 진행 중인지 확인
 * @param {number} userId
 * @param {number} missionId
 * @returns {boolean}
 */
export const isMissionAlreadyChallenged = async (userId, missionId) => {
    const existing = await prisma.userMission.findFirst({
        where: {
            userId: Number(userId),
            missionId: Number(missionId),
            status: "ONGOING",
        },
        select: { id: true },
    });
    return !!existing;
};

/**
 * 새로운 미션 도전 기록 생성
 * @param {number} userId
 * @param {number} missionId
 * @returns {number} 새 UserMission ID
 */
export const startNewChallenge = async (userId, missionId) => {
    const newChallenge = await prisma.userMission.create({
        data: {
            userId: Number(userId),
            missionId: Number(missionId),
            status: "ONGOING",
        },
        select: { id: true },
    });
    return newChallenge.id;
};
