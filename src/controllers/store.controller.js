import { StatusCodes } from "http-status-codes";
import { addStoreToRegion } from '../services/store.service.js';
import { addReviewToStore } from '../services/review.service.js';

// --- 1. 특정 지역에 가게 추가 (POST /api/v1/regions/:regionId/stores) ---
export const handleAddStore = async (req, res, next) => {
    const regionId = parseInt(req.params.regionId);
    const storeData = req.body;
    
    try {
        const storeId = await addStoreToRegion(regionId, storeData);
        res.status(StatusCodes.CREATED).json({ 
            "success": true,
            "code": "S201",
            "message": "가게가 성공적으로 추가되었습니다.",
            "data": {
                "store_id": storeId,
                "name": storeData.name 
            }
        });
    } catch (error) {
        if (error.message.startsWith("M404")) {
            return res.status(StatusCodes.NOT_FOUND).json({
                "success": false,
                "code": "M404",
                "message": "해당 지역을 찾을 수 없습니다."
            });
        }
        next(error);
    }
};


// --- 2. 가게에 리뷰 추가 (POST /api/v1/stores/:storeId/reviews) ---
export const handleAddReview = async (req, res, next) => {
    const storeId = parseInt(req.params.storeId);
    const reviewData = req.body; 
    
    try {
        const reviewId = await ReviewService.addReviewToStore(storeId, reviewData);

        res.status(StatusCodes.CREATED).json({ 
            "success": true,
            "code": "S201",
            "message": "리뷰가 성공적으로 등록되었습니다.",
            "data": {
                "review_id": reviewId,
                "store_id": storeId
            }
        });
    } catch (error) {
        if (error.message.startsWith("M404")) {
            return res.status(StatusCodes.NOT_FOUND).json({
                "success": false,
                "code": "M404",
                "message": "해당 가게를 찾을 수 없습니다."
            });
        }
        next(error);
    }
};