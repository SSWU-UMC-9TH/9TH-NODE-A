import { prisma } from "../prisma.js";

// 1-1
export const existsRegion = async (regionId) => {
  const region = await prisma.appRegion.findUnique({
    where: { id: Number(regionId) },
  });
  return !!region;
};
export const insertStore = async ({ regionId, name, address }) => {
  const created = await prisma.appStore.create({
    data: { regionId: Number(regionId), name, address: address || null },
  });
  return created.id;
};

// 1-2
export const existsStore = async (storeId) => {
  const s = await prisma.appStore.findUnique({
    where: { id: Number(storeId) },
  });
  return !!s;
};
export const existsUser = async (userId) => {
  const u = await prisma.appUser.findUnique({ where: { id: Number(userId) } });
  return !!u;
};
export const insertReview = async ({ storeId, userId, content, rating }) => {
  const created = await prisma.appReview.create({
    data: {
      storeId: Number(storeId),
      userId: Number(userId),
      content: content || null,
      rating: Number(rating),
    },
  });
  return created.id;
};

// 1-3
export const existsMission = async (missionId) => {
  const m = await prisma.appMission.findUnique({
    where: { id: Number(missionId) },
  });
  return !!m;
};
export const existsStoreMission = async (storeId, missionId) => {
  const sm = await prisma.appStoreMission.findFirst({
    where: { storeId: Number(storeId), missionId: Number(missionId) },
  });
  return !!sm;
};
export const insertStoreMission = async ({ storeId, missionId }) => {
  const created = await prisma.appStoreMission.create({
    data: { storeId: Number(storeId), missionId: Number(missionId) },
  });
  return created.id;
};

// 1-4
export const existsUserMission = async (userId, missionId) => {
  const um = await prisma.appUserMission.findUnique({
    where: {
      userId_missionId: {
        userId: Number(userId),
        missionId: Number(missionId),
      },
    },
  });
  return !!um;
};
export const insertUserMission = async ({ userId, missionId }) => {
  const created = await prisma.appUserMission.create({
    data: { userId: Number(userId), missionId: Number(missionId) },
  });
  return created.id;
};
