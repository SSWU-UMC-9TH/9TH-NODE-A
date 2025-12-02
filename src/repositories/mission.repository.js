import { prisma } from "../db.config.js";

export const createMission = async ({
  storeId,
  title,
  description,
  rewardPoints,
  startDate,
  endDate,
  isActive,
}) => {
  const row = await prisma.mission.create({
    data: {
      storeId,
      title,
      description,
      rewardPoints,
      startDate,
      endDate,
      isActive,
    },
  });
  return row;
};

export const findMissionById = async (missionId) => {
  return await prisma.mission.findUnique({
    where: { id: missionId },
  });
};

export const isAlreadyChallenging = async ({ userId, missionId }) => {
  // 복합 유니크 키 기반 빠른 조회 (아래 schema 수정 참고)
  const existing = await prisma.userMissionChallenge.findUnique({
    where: {
      userId_missionId: { userId, missionId },
    },
    select: { status: true },
  });
  return existing?.status === "CHALLENGING";
};

export const createUserMissionChallenge = async ({ userId, missionId }) => {
  const row = await prisma.userMissionChallenge.create({
    data: {
      userId,
      missionId,
      status: "CHALLENGING",
    },
  });
  return row;
};

export const getMissionsByStore = async (storeId, onlyActive = null, cursorId = 0, take = 5) => {
  const where = { storeId, ...(onlyActive === null ? {} : { isActive: !!onlyActive }) };
  return await prisma.mission.findMany({
    where: cursorId ? { ...where, id: { lt: cursorId } } : where,
    orderBy: [{ id: "desc" }],
    take, // 기본 5
    select: {
      id: true, storeId: true, title: true, description: true,
      rewardPoints: true, startDate: true, endDate: true,
      isActive: true, createdAt: true,
    },
  });
};

export const getMyChallengingMissions = async (userId, cursorId = 0, take = 5) => {
  const where = { userId, status: "CHALLENGING" };
  return await prisma.userMissionChallenge.findMany({
    where: cursorId ? { ...where, id: { lt: cursorId } } : where,
    orderBy: [{ id: "desc" }],
    take, // 기본 5
    select: {
      id: true, status: true, startedAt: true, missionId: true,
      mission: {
        select: {
          id: true, title: true, description: true,
          rewardPoints: true, startDate: true, endDate: true,
          isActive: true, storeId: true,
          store: { select: { id: true, name: true, address: true } },
        },
      },
    },
  });
};

export const completeMyChallenge = async (userId, missionId) => {
  // 현재 진행중인 건만 업데이트
  const { count } = await prisma.userMissionChallenge.updateMany({
    where: { userId, missionId, status: "CHALLENGING" },
    data: { status: "COMPLETED", completedAt: new Date() },
  });
  if (count === 0) return null;

  // 변경 결과 반환
  return prisma.userMissionChallenge.findUnique({
    where: { userId_missionId: { userId, missionId } }, // @@unique([userId, missionId])
    select: {
      id: true, userId: true, missionId: true, status: true,
      startedAt: true, completedAt: true,
    },
  });
};