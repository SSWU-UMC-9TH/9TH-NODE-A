import { StatusCodes } from "http-status-codes";
import { addStoreToRegion, checkStoreExist, getMissionsByStoreId, addRegion } from "../services/store.service.js";
import { addReviewToStore } from "../services/review.service.js";
import { ApiResponse } from "../responses/ApiResponse.js";
import { NotFoundError, BadRequestError, ConflictError, CustomError } from "../errors/CustomError.js";
import { response } from "express";

// 지역 추가
export const handleAddRegion = async (req, res, next) => {
    /*
    #swagger.tags = ['Region']
    #swagger.summary = '지역 추가 API'
    #swagger.description = '새로운 지역을 추가합니다.'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "강남구" }
            },
            required: ["name"]
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "지역 추가 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      region_id: { type: "integer", example: 1 },
                      name: { type: "string", example: "강남구" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "요청 바디에 name 누락 등 잘못된 요청",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: { type: "object", example: { code: "B400", message: "지역 이름(name)이 필요합니다." }},
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }

    #swagger.responses[409] = {
      description: "이미 존재하는 지역 이름인 경우",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: { type: "object", example: { code: "M409", message: "이미 존재하는 지역 이름 입니다." }},
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
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
    /*
    #swagger.tags = ['Store']
    #swagger.summary = '특정 지역에 가게 추가 API'
    #swagger.description = '지역 ID(regionId)에 해당하는 지역에 새로운 가게를 추가합니다.'

    #swagger.parameters['regionId'] = {
      in: 'path',
      required: true,
      description: '가게를 추가할 지역 ID',
      schema: { type: 'integer', example: 1 }
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "UMC 카페" },
              address: { type: "string", example: "서울시 성북구 어딘가 123" },
              description: { type: "string", example: "테스트용 가게입니다." }
            },
            required: ["name"]
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "가게 추가 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      store_id: { type: "integer", example: 10 },
                      name: { type: "string", example: "UMC 카페" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "유효하지 않은 regionId 또는 가게 이름 누락",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: { type: "object", example: { code: "B400", message: "유효한 regionID와 가게 이름이 필요합니다." }},
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "해당 지역을 찾을 수 없는 경우",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: { type: "object", example: { code: "M404", message: "해당 지역을 찾을 수 없습니다." }},
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
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
    /*
    #swagger.tags = ['Review']
    #swagger.summary = '가게 리뷰 등록 API'
    #swagger.description = '특정 가게(storeId)에 대한 리뷰를 등록합니다.'

    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      description: '리뷰를 남길 가게 ID',
      schema: { type: 'integer', example: 1 }
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId:  { type: "integer", example: 3 },
              rating:  { type: "number",  example: 4.5 },
              content: { type: "string",  example: "친절하고 분위기도 좋아요!" }
            },
            required: ["userId", "rating"]
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "리뷰 등록 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      review_id: { type: "integer", example: 100 },
                      store_id:  { type: "integer", example: 1 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "storeId, userId, rating이 유효하지 않은 경우",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: { type: "object", example: { code: "B400", message: "유효한 storeId, userId, rating이 필요합니다." }},
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "해당 가게를 찾을 수 없는 경우",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: { type: "object", example: { code: "M404", message: "해당 가게를 찾을 수 없습니다." }},
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
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
    /*
    #swagger.tags = ['Mission']
    #swagger.summary = '특정 가게 미션 목록 조회 API'
    #swagger.description = '특정 가게(storeId)에 등록된 미션 목록을 페이지네이션하여 조회합니다.'

    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      description: '미션을 조회할 가게 ID',
      schema: { type: 'integer', example: 1 }
    }

    #swagger.parameters['page'] = {
      in: 'query',
      required: false,
      description: '페이지 번호 (기본값: 1)',
      schema: { type: 'integer', example: 1 }
    }

    #swagger.parameters['size'] = {
      in: 'query',
      required: false,
      description: '페이지 크기 (기본값: 10)',
      schema: { type: 'integer', example: 10 }
    }

    #swagger.responses[200] = {
      description: "가게 미션 목록 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "object",
                    description: "서비스에서 정의한 미션 목록 + 페이지 정보 구조",
                    additionalProperties: true
                  }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "유효하지 않은 storeId, page, size 값",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: { type: "object", example: { code: "B400", message: "유효한 storeId, 페이지 번호, 크기가 필요합니다." }},
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "해당 가게를 찾을 수 없는 경우",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: { type: "object", example: { code: "M404", message: "해당 가게를 찾을 수 없습니다." }},
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
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
