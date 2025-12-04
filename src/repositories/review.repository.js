import { prisma } from "../db.config.js";

export const createReview = async ({ storeId, userId, rating, content }) => {
  const row = await prisma.review.create({
    data: {
      storeId,
      userId,
      rating,
      content,
    },
  });
  return row;
};

export const getMyReviews = async (userId, cursorId = 0, take = 5) => {
  const where = { userId };
  const reviews = await prisma.review.findMany({
    where: cursorId ? { ...where, id: { lt: cursorId } } : where,
    orderBy: [{ id: "desc" }],
    take, // 기본 5
    select: {
      id: true,
      rating: true,
      content: true,
      createdAt: true,
      storeId: true,
      store: { select: { id: true, name: true } },
      userId: true,
    },
  });
  return reviews;
};