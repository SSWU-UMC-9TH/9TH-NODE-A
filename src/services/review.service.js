import { isStoreExist } from "../repositories/store.repository.js";
import { insertReview } from "../repositories/review.repository.js"; // 없으면 store.repository에 있는 RAW/ORM 사용

export async function addReviewToStore(storeId, reviewData) {
    const exists = await isStoreExist(storeId);
    if (!exists) {
        const e = new Error("M404: store not found");
        throw e;
    }
    // reviewData: { userId, missionId?, rating, content }
    return insertReview(
        storeId,
        reviewData.userId,
        reviewData.missionId,
        reviewData.rating,
        reviewData.content ?? ""
    );
}
