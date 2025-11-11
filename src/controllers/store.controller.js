import { StatusCodes } from "http-status-codes";
import { addStoreToRegion, checkStoreExist, getMissionsByStoreId, addRegion } from "../services/store.service.js";
import { addReviewToStore } from "../services/review.service.js";

// 지역 추가
export const handleAddRegion = async (req, res, next) => {
    const { name } = req.body;

    // 입력 유효성 검사
    if (!name) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            code: "C400",
            message: "지역 이름(name)이 필요합니다.",
        });
    }

    try {
        // 서비스 계층 함수 호출
        const regionId = await addRegion(name); 

        res.status(StatusCodes.CREATED).json({
            success: true,
            code: "S201",
            message: "지역이 성공적으로 추가되었습니다.",
            data: { region_id: regionId, name },
        });

    } catch (error) {
        // Prisma 고유 오류 (P2002: Unique constraint violation) 등 처리
        if (error.code === "P2002") {
             return res.status(StatusCodes.CONFLICT).json({
                success: false,
                code: "M409",
                message: "이미 존재하는 지역 이름입니다.",
            });
        }
        next(error);
    }
};

// --- 1) 특정 지역에 가게 추가: POST /api/v1/regions/:regionId/stores ---
export const handleAddStore = async (req, res, next) => {
    const regionId = parseInt(req.params.regionId, 10);
    const storeData = req.body;

    if (Number.isNaN(regionId) || !storeData?.name) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            code: "C400",
            message: "유효한 regionId와 가게 이름이 필요합니다.",
        });
    }

    try {
        const storeId = await addStoreToRegion(regionId, storeData);
        res.status(StatusCodes.CREATED).json({
            success: true,
            code: "S201",
            message: "가게가 성공적으로 추가되었습니다.",
            data: { store_id: storeId, name: storeData.name },
        });
    } catch (error) {
        if (String(error.message).startsWith("M404")) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                code: "M404",
                message: "해당 지역을 찾을 수 없습니다.",
            });
        }
        next(error);
    }
};

// --- 2) 가게에 리뷰 추가: POST /api/v1/stores/:storeId/reviews ---
export const handleAddReview = async (req, res, next) => {
    const storeId = parseInt(req.params.storeId, 10);
    const reviewData = req.body;

    if (Number.isNaN(storeId) || !reviewData?.userId || reviewData?.rating == null) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            code: "C400",
            message: "유효한 storeId, userId, rating이 필요합니다.",
        });
    }

    try {

        const reviewId = await addReviewToStore(storeId, reviewData);

        res.status(StatusCodes.CREATED).json({
            success: true,
            code: "S201",
            message: "리뷰가 성공적으로 등록되었습니다.",
            data: { review_id: reviewId, store_id: storeId },
        });
    } catch (error) {
        if (String(error.message).startsWith("M404")) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                code: "M404",
                message: "해당 가게를 찾을 수 없습니다.",
            });
        }
        next(error);
    }
};

// 특정 가게 미션 목록 조회
export const handleGetStoreMissions = async (req, res, next) => {
    try {
        const storeId = parseInt(req.params.storeId, 10);
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;

        // 1. 유효성 검사
        if (Number.isNaN(storeId) || page < 1 || size < 1) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                code: "C400",
                message: "유효한 storeId, 페이지 번호, 크기가 필요합니다.",
            });
        }

        // 2. 가게 존재 여부 확인
        if (!(await checkStoreExist(storeId))) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                code: "M404",
                message: "해당 가게를 찾을 수 없습니다.",
            });
        }

        // 3. 서비스 함수 호출
        const missions = await getMissionsByStoreId(storeId, { page, size });

        // 4. 성공 응답
        res.status(StatusCodes.OK).json({
            success: true,
            code: "S200",
            message: "가게 미션 목록 조회 성공",
            data: missions,
        });

    } catch (error) {
        // 기타 서버 에러 처리
        next(error);
    }
};
