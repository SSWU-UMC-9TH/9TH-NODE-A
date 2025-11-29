import { StatusCodes } from "http-status-codes";
import { addStoreToRegion, listStoreReviews } from "../services/store.service.js";

export const handleAddStoreToRegion = async (req, res, next) => {
  try {
    const regionId = Number(req.params.regionId);
    const userId = req.user.id;
    const result = await addStoreToRegion({ regionId, body: req.body, userId });
    return res.status(StatusCodes.CREATED).success(result);
  } catch (e) {
    return next(e);
  }
  /*
    #swagger.summary = '특정 지역에 상점 등록 API'
    #swagger.parameters['regionId'] = {
      in: 'path',
      required: true,
      description: '상점을 등록할 지역 ID',
      schema: { type: 'number', example: 1 }
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name"],
            properties: {
              name: { type: "string", description: "가게명", example: "맛있는 떡볶이집" },
              address: { type: "string", description: "가게 주소", example: "서울시 강남구 ..." },
              foodCategoryId: { type: "number", nullable: true, description: "음식 카테고리 ID(선택)" }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "상점 등록 성공 응답",
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
                  id: { type: "number", example: 10 },
                  name: { type: "string", example: "맛있는 떡볶이집" },
                  address: { type: "string", example: "서울시 강남구 ..." },
                  regionId: { type: "number", example: 1 },
                  foodCategoryId: { type: "number", nullable: true, example: 3 },
                  createdByUserId: { type: "number", example: 1 },
                  createdAt: { type: "string", format: "date-time" }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "요청 유효성 오류(예: name 누락)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "VAL001" },
                  reason: { type: "string", example: "가게명(name)은 필수입니다." },
                  data: {
                    type: "object",
                    example: { field: "name" }
                  }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: "지역 없음 또는 사용자 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: {
                    type: "string",
                    example: "NOT_FOUND",
                    description: "NOT_FOUND(지역 없음), U404(사용자 없음) 등"
                  },
                  reason: { type: "string", example: "존재하지 않는 지역입니다." },
                  data: {
                    type: "object",
                    example: { regionId: 999 }
                  }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
};

export const handleListStoreReviews = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;
    const reviews = await listStoreReviews(storeId, cursor);
    return res.status(StatusCodes.OK).success(reviews);
  } catch (e) {
    return next(e);
  }
  /*
    #swagger.summary = '상점 리뷰 목록 조회 API'
    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      description: '리뷰를 조회할 상점 ID',
      schema: { type: 'number', example: 1 }
    }
    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      description: '마지막으로 조회한 리뷰 ID (커서 기반 페이지네이션). 지정하지 않으면 0부터 조회',
      schema: { type: 'number', example: 10 }
    }
    #swagger.responses[200] = {
      description: "상점 리뷰 목록 조회 성공 응답",
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
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number", example: 3 },
                        content: {
                          type: "string",
                          example: "떡볶이가 너무 맛있어요!"
                        },
                        rating: {
                          type: "number",
                          description: "별점(1~5)",
                          example: 5
                        },
                        storeId: { type: "number", example: 1 },
                        userId: { type: "number", example: 1 },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                          example: "2025-11-18T10:00:00.000Z"
                        },
                        user: {
                          type: "object",
                          description: "리뷰 작성자 정보",
                          properties: {
                            id: { type: "number", example: 1 },
                            name: { type: "string", example: "UMC" }
                          }
                        }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: {
                        type: "number",
                        nullable: true,
                        description: "다음 페이지 조회를 위한 마지막 리뷰 ID. 더 이상 없으면 null",
                        example: 15
                      }
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
      description: "잘못된 파라미터로 인한 실패 (storeId나 cursor가 숫자가 아닌 경우 등)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: {
                    type: "string",
                    example: "VAL001",
                    description: "파라미터 검증 실패 코드(예시)"
                  },
                  reason: {
                    type: "string",
                    example: "storeId는 숫자여야 합니다."
                  },
                  data: {
                    type: "object",
                    example: { storeId: "abc" }
                  }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
    #swagger.responses[500] = {
      description: "서버 내부 오류",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: {
                    type: "string",
                    example: "unknown",
                    description: "정의되지 않은 서버 오류 코드"
                  },
                  reason: {
                    type: "string",
                    example: "서버 오류가 발생했습니다."
                  },
                  data: {
                    type: "object",
                    nullable: true,
                    example: null
                  }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
};
