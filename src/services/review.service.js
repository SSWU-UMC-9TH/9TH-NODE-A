import { isStoreExist, insertReview } from '../repositories/store.repository.js';

export const addReviewToStore = async (storeId, reviewData) => {
    
    // 1. 가게 존재 검증
    const exists = await isStoreExist(storeId); 
    
    if (!exists) {
        throw new Error("M404: 해당 가게를 찾을 수 없습니다.");
    }

    // 2. 리뷰 삽입
    // mission_id가 reviewData에 포함되어 있다고 가정하고 Repository로 전달합니다.
    const reviewId = await insertReview( 
        storeId,
        reviewData.user_id,
        reviewData.mission_id,
        reviewData.rating,
        reviewData.content
    );

    return reviewId;
};