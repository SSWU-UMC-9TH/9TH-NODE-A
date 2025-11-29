import { prisma } from "../db.config.js";

export const findRegionById = async (regionId) => {
  return await prisma.region.findUnique({
    where: { id: regionId },
  });
};