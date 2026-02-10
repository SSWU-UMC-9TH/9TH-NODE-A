import { StatusCodes } from "http-status-codes";
import * as service from "../services/user.service.js";

export const getMyReviews = async (req, res, next) => {
  /*
    #swagger.summary = '내가 작성한 리뷰 목록 조회'
    #swagger.tags = ['User']

    #swagger.parameters['userId'] = {
      in: 'path',
      description: '사용자 ID',
      required: true,
      schema: { type: 'integer', example: 1 }
    }

    #swagger.responses[200] = {
      description: "리뷰 목록 조회 성공",
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
                        id: { type: "number", example: 1 },
                        content: { type: "string", example: "맛있어요!" },
                        rating: { type: "number", example: 5 },
                        store: {
                          type: "object",
                          properties: {
                            id: { type: "number", example: 1 },
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
        }
      }
    }

    #swagger.responses[404] = {
      description: "해당 사용자의 리뷰가 없다고 가정한 오류(UserNotFoundError 사용 중)",
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
                  reason: { type: "string", example: "사용자가 존재하지 않습니다." },
                  data: { type: "object", example: { userId: 999 } }
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
    const data = await service.listMyReviews(Number(req.params.userId));
    res.status(StatusCodes.OK).success({ data });
  } catch (e) {
    next(e);
  }
};

export const getStoreMissions = async (req, res, next) => {
  /*
    #swagger.summary = '특정 가게의 미션 목록 조회'
    #swagger.tags = ['Mission']

    #swagger.parameters['storeId'] = {
      in: 'path',
      description: '가게 ID',
      required: true,
      schema: { type: 'integer', example: 1 }
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
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        missionId: { type: "number", example: 1 },
                        title: { type: "string", example: "리뷰 작성하기" },
                        rewardPoint: { type: "number", example: 100 }
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

    #swagger.responses[500] = {
      description: "서버 내부 오류 (DB 문제 등)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "unknown" },
                  reason: { type: "string", example: "Internal Server Error" },
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
  try {
    const data = await service.listStoreMissions(Number(req.params.storeId));
    res.status(StatusCodes.OK).success({ data });
  } catch (e) {
    next(e);
  }
};

export const getMyInProgressMissions = async (req, res, next) => {
  /*
    #swagger.summary = '내가 진행 중인 미션 목록 조회'
    #swagger.tags = ['Mission', 'User']

    #swagger.parameters['userId'] = {
      in: 'path',
      description: '사용자 ID',
      required: true,
      schema: { type: 'integer', example: 1 }
    }

    #swagger.responses[200] = {
      description: "진행 중인 미션 목록 조회 성공",
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
                        missionId: { type: "number", example: 1 },
                        title: { type: "string", example: "리뷰 작성하기" },
                        status: { type: "string", example: "in_progress" }
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
  */
  try {
    const data = await service.listMyInProgressMissions(
      Number(req.params.userId)
    );
    res.status(StatusCodes.OK).success({ data });
  } catch (e) {
    next(e);
  }
};

export const completeMission = async (req, res, next) => {
  /*
    #swagger.summary = '내 미션 완료 처리'
    #swagger.tags = ['Mission', 'User']

    #swagger.parameters['userId'] = {
      in: 'path',
      description: '사용자 ID',
      required: true,
      schema: { type: 'integer', example: 1 }
    }

    #swagger.parameters['missionId'] = {
      in: 'path',
      description: '미션 ID',
      required: true,
      schema: { type: 'integer', example: 3 }
    }

    #swagger.responses[200] = {
      description: "미션 완료 처리 성공",
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
                  userId: { type: "number", example: 1 },
                  missionId: { type: "number", example: 3 },
                  status: { type: "string", example: "completed" }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "진행 중인 미션이 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "UM404" },
                  reason: { type: "string", example: "진행 중인 미션이 없습니다." },
                  data: { type: "object", example: { userId: 1, missionId: 3 } }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }

    #swagger.responses[409] = {
      description: "이미 완료된 미션",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "UM409" },
                  reason: { type: "string", example: "이미 완료된 미션입니다." },
                  data: { type: "object", example: { userId: 1, missionId: 3 } }
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
    const result = await service.completeMyMission(
      Number(req.params.userId),
      Number(req.params.missionId)
    );
    res.status(StatusCodes.OK).success(result);
  } catch (e) {
    next(e);
  }
};
