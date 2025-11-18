import prisma from "../db.config.js";

export const isMissionExist = async (missionId) => {
    const count = await prisma.mission.count({
        where: { id: missionId },
    });
    return count > 0;
};

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
