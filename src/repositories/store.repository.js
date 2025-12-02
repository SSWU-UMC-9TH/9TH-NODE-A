import { prisma } from "../db.config.js";

export const createStore = async ({
  name,
  address,
  regionId,
  foodCategoryId,
  createdByUserId,
}) => {
  const row = await prisma.store.create({
    data: {
      name,
      address,
      regionId,
      foodCategoryId,
      createdByUserId,
    },
  });
  return row;
};

export const findStoreById = async (storeId) => {
  return await prisma.store.findUnique({
    where: { id: storeId },
  });
};

export const getAllStoreReviews = async (storeId, cursor = 0) => {
  return await prisma.review.findMany({
    select: {
      id: true,
      content: true,
      rating: true,
      storeId: true,
      userId: true,
      createdAt: true,
      user: { select: { id: true, name: true } },
    },
    where: { storeId, id: { gt: cursor } },
    orderBy: { id: "asc" },
    take: 5,
  });
};