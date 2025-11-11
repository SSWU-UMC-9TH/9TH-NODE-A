import { responseFromStore, bodyToCreateStore, responseFromReviews } from "../dtos/store.dto.js";
import { findFirstUserId, findRegionById } from "../repositories/common.repository.js";
import { createStore, getAllStoreReviews } from "../repositories/store.repository.js";
import { MissingUserError, NotFoundError, ValidationError } from "../errors.js";

export const addStoreToRegion = async ({ regionId, body }) => {
  const region = await findRegionById(regionId);
  if (!region) throw new NotFoundError("존재하지 않는 지역입니다.", { regionId });

  const userId = await findFirstUserId();
  if (!userId) throw new MissingUserError();

  const payload = bodyToCreateStore(body);
  if (!payload.name) throw new ValidationError("가게명(name)은 필수입니다.", { field: "name" });

  const row = await createStore({
    name: payload.name,
    address: payload.address,
    regionId,
    foodCategoryId: payload.foodCategoryId,
    createdByUserId: userId,
  });

  return responseFromStore(row);
};

export const listStoreReviews = async (storeId, cursor = 0) => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};
