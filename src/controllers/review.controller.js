import { StatusCodes } from "http-status-codes";
import { addReviewToStore, listMyReviews } from "../services/review.service.js";

export const handleAddReviewToStore = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    const userId = req.user.id;
    const result = await addReviewToStore({ storeId, body: req.body, userId });
    return res.status(StatusCodes.CREATED).success(result);
  } catch (e) {
    return next(e);
  }
  /*
    #swagger.summary = '가게에 리뷰 작성 API'
    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      description: '리뷰를 작성할 상점 ID',
      schema: { type: 'number', example: 1 }
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["rating", "content"],
            properties: {
              rating: { type: "number", description: "별점(1~5 정수)", example: 5 },
              content: { type: "string", description: "리뷰 내용", example: "음식이 너무 맛있었어요!" }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "리뷰 작성 성공 응답",
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
                  id: { type: "number", example: 3 },
                  storeId: { type: "number", example: 1 },
                  userId: { type: "number", example: 1 },
                  rating: { type: "number", example: 5 },
                  content: { type: "string", example: "음식이 너무 맛있었어요!" },
                  createdAt: { type: "string", format: "date-time" }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "요청 유효성 오류 (rating 범위, content 누락 등)",
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
                  reason: {
                    type: "string",
                    example: "rating은 1~5 사이 정수여야 합니다."
                  },
                  data: {
                    type: "object",
                    example: { field: "rating" }
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
      description: "가게 없음 또는 사용자 없음",
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
                    description: "NOT_FOUND(가게 없음), U404(사용자 없음) 등"
                  },
                  reason: { type: "string", example: "리뷰를 달 가게가 존재하지 않습니다." },
                  data: { type: "object", nullable: true }
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

export const handleListMyReviews = async (req, res, next) => {
  try {
    const cursor = Number.isFinite(Number(req.query?.cursor)) ? Number(req.query.cursor) : 0;
    const take   = Number.isFinite(Number(req.query?.take))   ? Number(req.query.take)   : 5;
    const userId = req.user.id;

    const result = await listMyReviews(cursor, take, userId);
    return res.status(StatusCodes.OK).success(result);
  } catch (e) {
    return next(e);
  }
  /*
    #swagger.summary = '내가 작성한 리뷰 목록 조회 API'
    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      description: '이전 페이지의 마지막 리뷰 ID (커서 기반 페이지네이션)',
      schema: { type: 'number', example: 10 }
    }
    #swagger.parameters['take'] = {
      in: 'query',
      required: false,
      description: '가져올 리뷰 개수 (기본값 5)',
      schema: { type: 'number', example: 5 }
    }
    #swagger.responses[200] = {
      description: "내 리뷰 목록 조회 성공 응답",
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
                        rating: { type: "number", example: 5 },
                        content: { type: "string", example: "또 방문하고 싶어요." },
                        createdAt: { type: "string", format: "date-time" },
                        storeId: { type: "number", example: 1 },
                        userId: { type: "number", example: 1 },
                        store: {
                          type: "object",
                          properties: {
                            id: { type: "number", example: 1 },
                            name: { type: "string", example: "맛있는 떡볶이집" }
                          }
                        }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: { type: "number", nullable: true, example: 15 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: "사용자 없음 (선행 회원가입 필요)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U404" },
                  reason: {
                    type: "string",
                    example: "사용자가 없습니다. 먼저 사용자를 생성하세요."
                  },
                  data: { type: "object", nullable: true, example: null }
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
