import { bodyToCreateReview, responseFromReview } from "../dtos/review.dto.js";
import { findStoreById } from "../repositories/store.repository.js";
import { createReview, getMyReviews } from "../repositories/review.repository.js";
import { MissingUserError, NotFoundError, ValidationError } from "../errors.js";

export const addReviewToStore = async ({ storeId, body, userId }) => {
  const store = await findStoreById(storeId);
  if (!store) throw new NotFoundError("리뷰를 달 가게가 존재하지 않습니다.", { storeId });

  if (!userId) throw new MissingUserError();

  const payload = bodyToCreateReview(body);
  if (!payload.rating || payload.rating < 1 || payload.rating > 5) {
    throw new ValidationError("rating은 1~5 사이 정수여야 합니다.", { field: "rating" });
  }
  if (!payload.content) throw new ValidationError("content는 필수입니다.", { field: "content" });

  const row = await createReview({
    storeId,
    userId,
    rating: payload.rating,
    content: payload.content,
  });
  return responseFromReview(row);
};

export const listMyReviews = async (cursor = 0, take = 5, userId) => {
  if (!userId) throw new MissingUserError();

  const rows = await getMyReviews(userId, cursor, take);
  return {
    data: rows,
    pagination: { cursor: rows.length ? rows[rows.length - 1].id : null },
  };
};
