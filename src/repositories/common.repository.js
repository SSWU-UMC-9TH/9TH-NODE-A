import { prisma } from "../db.config.js";

export const findFirstUserId = async () => {
  const user = await prisma.user.findFirst({
    select: { id: true },
    orderBy: { id: "asc" },
  });
  return user?.id ?? null;
};

export const findRegionById = async (regionId) => {
  return await prisma.region.findUnique({
    where: { id: regionId },
  });
};