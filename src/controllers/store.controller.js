import { StatusCodes } from "http-status-codes";
import { addStoreToRegion, checkStoreExist, getMissionsByStoreId, addRegion } from "../services/store.service.js";
import { addReviewToStore } from "../services/review.service.js";
import { ApiResponse } from "../responses/ApiResponse.js";
import { NotFoundError, BadRequestError, ConflictError, CustomError } from "../errors/CustomError.js";
import { response } from "express";

// 지역 추가
export const handleAddRegion = async (req, res, next) => {
    const { name } = req.body;

    // 입력 유효성 검사
    if (!name) {
        throw new BadRequestError("지역 이름(name)이 필요합니다.");
    }

    try {
        // 서비스 계층 함수 호출
        const regionId = await addRegion(name);

        const response = ApiResponse(
            StatusCodes.CREATED,
            "S201",
            "지역이 성공적으로 추가되었습니다.",
            { region_id: regionId, name }
        );
        return res.status(response.status).json(response.body);

    } catch (error) {

        if (error.code === "P2002") {
            throw new ConflictError("이미 존재하는 지역 이름 입니다.", { internal_code: "M409" });
        }
        throw (error);
    }
};

// 특정 지역에 가게 추가: POST /api/v1/regions/:regionId/stores ---
export const handleAddStore = async (req, res, next) => {
    const regionId = parseInt(req.params.regionId, 10);
    const storeData = req.body;

    if (Number.isNaN(regionId) || !storeData?.name) {
        throw new BadRequestError("유효한 regionID와 가게 이름이 필요합니다.");
    }

    try {
        const storeId = await addStoreToRegion(regionId, storeData);
        const response = ApiResponse(
            StatusCodes.CREATED,
            "S201",
            "가게가 성공적으로 추가되었습니다.",
            { store_id: storeId, name: storeData.name }
        );
        return res.status(response.status).json(response.body);
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        } else if (String(error.message).includes("region not found")) {
            throw new NotFoundError("해당 지역을 찾을 수 없습니다.", { internal_code: "M404" });

        }
        throw (error);
    }
};

// 가게에 리뷰 추가: POST /api/v1/stores/:storeId/reviews ---
export const handleAddReview = async (req, res, next) => {
    const storeId = parseInt(req.params.storeId, 10);
    const reviewData = req.body;

    if (Number.isNaN(storeId) || !reviewData?.userId || reviewData?.rating == null) {
        throw new BadRequestError("유효한 storeId, userId, rating이 필요합니다.");
    }
    try {
        const reviewId = await addReviewToStore(storeId, reviewData);

        const response = ApiResponse(
            StatusCodes.CREATED,
            "S201",
            "리뷰가 성공적으로 등록되었습니다.",
            { review_id: reviewId, store_id: storeId }
        );
        return res.status(response.status).json(response.body);
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        } else if (String(error.message).includes("store not found")) {
            throw new NotFoundError("해당 가게를 찾을 수 없습니다.", { internal_code: "M404" });
        }
        throw error;
    }
};


// 특정 가게 미션 목록 조회
export const handleGetStoreMissions = async (req, res, next) => {
    const storeId = parseInt(req.params.storeId, 10);
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    if (Number.isNaN(storeId) || page < 1 || size < 1) {
        throw new BadRequestError("유효한 storeId, 페이지 번호, 크기가 필요합니다.");
    }

    if (!(await checkStoreExist(storeId))) {
        throw new NotFoundError("해당 가게를 찾을 수 없습니다.", { internal_code: "M404" });
    }

    const missions = await getMissionsByStoreId(storeId, { page, size });

    const response = ApiResponse(
        StatusCodes.OK,
        "S200",
        "가게 미션 목록 조회 성공",
        missions
    );
    return res.status(response.status).json(response.body);
};
