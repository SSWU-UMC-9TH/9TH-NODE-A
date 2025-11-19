import { prisma } from "../prisma.js";

// 2) 내가 작성한 리뷰 목록
export const findUserReviews = async (userId) => {
  return prisma.appReview.findMany({
    where: { userId: Number(userId) },
    orderBy: { id: "desc" },
    include: { store: true }, // store 정보 같이
  });
};

// 3) 특정 가게의 미션 목록
export const findStoreMissions = async (storeId) => {
  return prisma.appStoreMission.findMany({
    where: { storeId: Number(storeId) },
    orderBy: { missionId: "asc" },
    include: { mission: true }, // 미션 정보 같이
  });
};

// 4) 내가 진행 중인 미션 목록
export const findInProgressMissions = async (userId) => {
  return prisma.appUserMission.findMany({
    where: { userId: Number(userId), status: "in_progress" },
    orderBy: { missionId: "asc" },
    include: { mission: true },
  });
};

// 5) 내 미션 완료 처리
export const completeUserMission = async (userId, missionId) => {
  const key = { userId: Number(userId), missionId: Number(missionId) };

  const exists = await prisma.appUserMission.findUnique({
    where: { userId_missionId: key },
  });
  if (!exists) throw new Error("진행 중인 미션이 없습니다.");
  if (exists.status === "completed") throw new Error("이미 완료된 미션입니다.");

  return prisma.appUserMission.update({
    where: { userId_missionId: key },
    data: { status: "completed" },
  });
};

// 5-2. 특정 유저-미션 조합 조회 (존재 여부 확인용)
export const findUserMission = async (userId, missionId) => {
  return prisma.appUserMission.findUnique({
    where: {
      userId_missionId: {
        userId: Number(userId),
        missionId: Number(missionId),
      },
    },
  });
};
