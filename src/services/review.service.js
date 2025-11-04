import { bodyToCreateReview, responseFromReview } from "../dtos/review.dto.js";
import { findFirstUserId } from "../repositories/common.repository.js";
import { findStoreById } from "../repositories/store.repository.js";
import { createReview, getMyReviews } from "../repositories/review.repository.js";

export const addReviewToStore = async ({ storeId, body }) => {
  const store = await findStoreById(storeId);
  if (!store) throw new Error("리뷰를 달 가게가 존재하지 않습니다.");

  const userId = await findFirstUserId();
  if (!userId) throw new Error("사용자가 없습니다. 먼저 사용자를 생성하세요.");

  const payload = bodyToCreateReview(body);
  if (!payload.rating || payload.rating < 1 || payload.rating > 5) {
    throw new Error("rating은 1~5 사이 정수여야 합니다.");
  }
  if (!payload.content) throw new Error("content는 필수입니다.");

  const row = await createReview({
    storeId,
    userId,
    rating: payload.rating,
    content: payload.content,
  });
  return responseFromReview(row);
};

export const listMyReviews = async (cursor = 0, take = 5, userIdFromReq) => {
  const userId = userIdFromReq ?? (await findFirstUserId());
  if (!userId) throw new Error("사용자가 없습니다. 먼저 사용자를 생성하세요.");

  const rows = await getMyReviews(userId, cursor, take);
  return {
    data: rows,
    pagination: { cursor: rows.length ? rows[rows.length - 1].id : null },
  };
};