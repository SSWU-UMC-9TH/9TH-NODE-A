import { responseFromStore } from "../dtos/store.dto.js";
import { bodyToCreateStore } from "../dtos/store.dto.js";
import { findFirstUserId, findRegionById } from "../repositories/common.repository.js";
import { createStore } from "../repositories/store.repository.js";

export const addStoreToRegion = async ({ regionId, body }) => {
  const region = await findRegionById(regionId);
  if (!region) throw new Error("존재하지 않는 지역입니다.");

  const userId = await findFirstUserId();
  if (!userId) throw new Error("사용자가 없습니다. 먼저 사용자를 생성하세요.");

  const payload = bodyToCreateStore(body);
  if (!payload.name) throw new Error("가게명(name)은 필수입니다.");

  const row = await createStore({
    name: payload.name,
    address: payload.address,
    regionId,
    foodCategoryId: payload.foodCategoryId,
    createdByUserId: userId,
  });

  return responseFromStore(row);
};

export const listStoreReviews = async (storeId) => {
  const reviews = await getAllStoreReviews(storeId);
  return responseFromReviews(reviews);
};
