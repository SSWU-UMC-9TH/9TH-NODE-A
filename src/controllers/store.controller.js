import { StatusCodes } from "http-status-codes";
import * as service from "../services/store.service.js";
import {
  toCreateStoreDto,
  toCreateReviewDto,
  toLinkMissionDto,
  toChallengeMissionDto,
} from "../dtos/store.dto.js";

// 성공은 통일 포맷(res.success), 에러는 next로 전달
export const createStore = async (req, res, next) => {
  /*
    #swagger.summary = '특정 지역에 가게 추가하기'
    #swagger.tags = ['Store']

    #swagger.parameters['regionId'] = {
      in: 'path',
      description: '지역 ID',
      required: true,
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
              address: { type: "string", example: "서울시 어딘가 123-45" }
            },
            required: ["name"]
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "가게 생성 성공",
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
                  storeId: { type: "number", example: 1 },
                  regionId: { type: "number", example: 1 },
                  name: { type: "string", example: "UMC 카페" },
                  address: { type: "string", example: "서울시 어딘가 123-45" }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "유효성 검증 실패 (예: name 없음)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "V400" },
                  reason: { type: "string", example: "가게 이름이 필요합니다." },
                  data: { type: "object", example: { name: null } }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "지역 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "R404" },
                  reason: { type: "string", example: "해당 지역이 존재하지 않습니다." },
                  data: { type: "object", example: { regionId: 999 } }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
  try {
    const result = await service.createStore(
      toCreateStoreDto(req.params, req.body)
    );
    res.status(StatusCodes.CREATED).success(result);
  } catch (e) {
    next(e);
  }
};

export const createReview = async (req, res, next) => {
  /*
    #swagger.summary = '가게에 리뷰 추가하기'
    #swagger.tags = ['Review']

    #swagger.parameters['storeId'] = {
      in: 'path',
      description: '가게 ID',
      required: true,
      schema: { type: 'integer', example: 1 }
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: { type: "number", example: 1 },
              content: { type: "string", example: "너무 맛있어요!" },
              rating: { type: "number", example: 5 }
            },
            required: ["userId", "rating"]
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "리뷰 생성 성공",
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
                  reviewId: { type: "number", example: 1 },
                  storeId: { type: "number", example: 1 },
                  userId: { type: "number", example: 1 },
                  rating: { type: "number", example: 5 }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "평점 유효성 오류 (1~5 범위 위반 등)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "V400" },
                  reason: { type: "string", example: "평점은 1~5 사이여야 합니다." },
                  data: { type: "object", example: { rating: 10 } }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "가게 또는 사용자 미존재",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "S404 / U404" },
                  reason: { type: "string", example: "가게가 존재하지 않습니다. / 사용자가 존재하지 않습니다." },
                  data: { type: "object", example: { storeId: 999, userId: 999 } }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
  try {
    const result = await service.createReview(
      toCreateReviewDto(req.params, req.body)
    );
    res.status(StatusCodes.CREATED).success(result);
  } catch (e) {
    next(e);
  }
};

export const linkMission = async (req, res, next) => {
  /*
    #swagger.summary = '가게에 미션 연결하기'
    #swagger.tags = ['Mission']

    #swagger.parameters['storeId'] = {
      in: 'path',
      description: '가게 ID',
      required: true,
      schema: { type: 'integer', example: 1 }
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              missionId: { type: "number", example: 1 }
            },
            required: ["missionId"]
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "가게-미션 연결 성공",
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
                  linkId: { type: "number", example: 1 },
                  storeId: { type: "number", example: 1 },
                  missionId: { type: "number", example: 1 }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "가게 또는 미션 미존재",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "S404 / M404" },
                  reason: { type: "string", example: "가게가 존재하지 않습니다. / 미션이 존재하지 않습니다." },
                  data: { type: "object", example: { storeId: 999, missionId: 999 } }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }

    #swagger.responses[409] = {
      description: "이미 연결된 미션",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M409" },
                  reason: { type: "string", example: "이미 연결된 미션입니다." },
                  data: { type: "object", example: { storeId: 1, missionId: 1 } }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
  try {
    const result = await service.linkMission(
      toLinkMissionDto(req.params, req.body)
    );
    res.status(StatusCodes.CREATED).success(result);
  } catch (e) {
    next(e);
  }
};

export const challengeMission = async (req, res, next) => {
  /*
    #swagger.summary = '미션 도전하기'
    #swagger.tags = ['Mission']

    #swagger.parameters['missionId'] = {
      in: 'path',
      description: '미션 ID',
      required: true,
      schema: { type: 'integer', example: 1 }
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: { type: "number", example: 1 }
            },
            required: ["userId"]
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "미션 도전 성공 (진행 중 상태)",
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
                  userMissionId: { type: "number", example: 1 },
                  userId: { type: "number", example: 1 },
                  missionId: { type: "number", example: 1 },
                  status: { type: "string", example: "in_progress" }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "사용자 또는 미션 미존재",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U404 / M404" },
                  reason: { type: "string", example: "사용자가 존재하지 않습니다. / 미션이 존재하지 않습니다." },
                  data: { type: "object", example: { userId: 999, missionId: 999 } }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }

    #swagger.responses[409] = {
      description: "이미 도전 중인 미션",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "C409" },
                  reason: { type: "string", example: "이미 도전 중입니다." },
                  data: { type: "object", example: { userId: 1, missionId: 1 } }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
  try {
    const result = await service.challengeMission(
      toChallengeMissionDto(req.params, req.body)
    );
    res.status(StatusCodes.CREATED).success(result);
  } catch (e) {
    next(e);
  }
};
