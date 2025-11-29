import { StatusCodes } from "http-status-codes";
import {
  addMissionToStore,
  challengeMission,
  listStoreMissions,
  listMyChallengingMissions,
  completeMyMission,
} from "../services/mission.service.js";

export const handleAddMissionToStore = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    const result = await addMissionToStore({ storeId, body: req.body });
    return res.status(StatusCodes.CREATED).success(result);
  } catch (e) {
    return next(e);
  }
  /*
    #swagger.summary = '가게에 미션 추가 API'
    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      description: '미션을 추가할 상점 ID',
      schema: { type: 'number', example: 1 }
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["title"],
            properties: {
              title: { type: "string", description: "미션 제목", example: "인증샷 업로드하고 100포인트 받기" },
              description: { type: "string", description: "미션 설명", example: "가게 전경 사진과 함께 리뷰를 작성해주세요." },
              rewardPoints: { type: "number", description: "보상 포인트", example: 100 },
              startDate: { type: "string", format: "date-time", nullable: true, description: "미션 시작일(선택)" },
              endDate: { type: "string", format: "date-time", nullable: true, description: "미션 종료일(선택)" },
              isActive: { type: "boolean", description: "미션 활성화 여부(기본 true)", example: true }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "미션 추가 성공 응답",
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
                  id: { type: "number", example: 1 },
                  storeId: { type: "number", example: 1 },
                  title: { type: "string" },
                  description: { type: "string" },
                  rewardPoints: { type: "number", example: 100 },
                  startDate: { type: "string", format: "date-time", nullable: true },
                  endDate: { type: "string", format: "date-time", nullable: true },
                  isActive: { type: "boolean", example: true },
                  createdAt: { type: "string", format: "date-time" }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "요청 유효성 오류 (title 누락 등)",
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
                  reason: { type: "string", example: "미션 제목(title)은 필수입니다." },
                  data: {
                    type: "object",
                    example: { field: "title" }
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
      description: "상점 없음 또는 사용자 없음",
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
                    description: "NOT_FOUND(상점 없음), U404(사용자 없음) 등"
                  },
                  reason: { type: "string", example: "미션을 추가할 가게가 존재하지 않습니다." },
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

export const handleChallengeMission = async (req, res, next) => {
  try {
    const missionId = Number(req.params.missionId);
    const userId = req.user.id;
    const result = await challengeMission({ missionId, userId });
    return res.status(StatusCodes.CREATED).success(result);
  } catch (e) {
    return next(e);
  }
  /*
    #swagger.summary = '미션 도전하기 API'
    #swagger.parameters['missionId'] = {
      in: 'path',
      required: true,
      description: '도전할 미션 ID',
      schema: { type: 'number', example: 1 }
    }
    #swagger.responses[201] = {
      description: "미션 도전 성공 응답",
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
                  id: { type: "number", example: 1 },
                  userId: { type: "number", example: 1 },
                  missionId: { type: "number", example: 1 },
                  status: { type: "string", example: "CHALLENGING" },
                  startedAt: { type: "string", format: "date-time" },
                  completedAt: { type: "string", format: "date-time", nullable: true }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: "미션 없음 또는 사용자 없음",
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
                    description: "NOT_FOUND(미션 없음), U404(사용자 없음) 등"
                  },
                  reason: {
                    type: "string",
                    example: "도전할 미션이 존재하지 않습니다."
                  },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
    #swagger.responses[409] = {
      description: "이미 도전 중인 미션 (중복 도전)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M001" },
                  reason: { type: "string", example: "이미 도전 중인 미션입니다." },
                  data: {
                    type: "object",
                    example: { missionId: 1, userId: 1 }
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

export const handleListStoreMissions = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    const activeParam = typeof req.query.active === "string" ? req.query.active : null;
    const onlyActive = activeParam === null ? null : activeParam === "true";
    const cursor = Number.isFinite(Number(req.query?.cursor)) ? Number(req.query.cursor) : 0;
    const take   = Number.isFinite(Number(req.query?.take))   ? Number(req.query.take)   : 5;

    const result = await listStoreMissions(storeId, onlyActive, cursor, take);
    return res.status(StatusCodes.OK).success(result);
  } catch (e) {
    return next(e);
  }
  /*
    #swagger.summary = '특정 가게의 미션 목록 조회 API'
    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      description: '미션을 조회할 상점 ID',
      schema: { type: 'number', example: 1 }
    }
    #swagger.parameters['active'] = {
      in: 'query',
      required: false,
      schema: { type: 'string', example: "true" }
    }
    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      schema: { type: 'number', example: 10 }
    }
    #swagger.parameters['take'] = {
      in: 'query',
      required: false,
      schema: { type: 'number', example: 5 }
    }
    #swagger.responses[200] = {
      description: "미션 목록 조회 성공 응답",
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
                        storeId: { type: "number", example: 1 },
                        title: { type: "string" },
                        description: { type: "string" },
                        rewardPoints: { type: "number", example: 100 },
                        startDate: { type: "string", format: "date-time", nullable: true },
                        endDate: { type: "string", format: "date-time", nullable: true },
                        isActive: { type: "boolean", example: true },
                        createdAt: { type: "string", format: "date-time" }
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
      description: "상점 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "NOT_FOUND" },
                  reason: { type: "string", example: "가게가 존재하지 않습니다." },
                  data: { type: "object", example: { storeId: 999 } }
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

export const handleListMyChallengingMissions = async (req, res, next) => {
  try {
    const cursor = Number.isFinite(Number(req.query?.cursor)) ? Number(req.query.cursor) : 0;
    const take   = Number.isFinite(Number(req.query?.take))   ? Number(req.query.take)   : 5;
    const userId = req.user.id;

    const result = await listMyChallengingMissions(cursor, take, userId);
    return res.status(StatusCodes.OK).success(result);
  } catch (e) {
    return next(e);
  }
  /*
    #swagger.summary = '내가 진행 중인 미션 목록 조회 API'
    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      schema: { type: 'number', example: 10 }
    }
    #swagger.parameters['take'] = {
      in: 'query',
      required: false,
      schema: { type: 'number', example: 5 }
    }
    #swagger.responses[200] = {
      description: "진행 중인 미션 목록 조회 성공 응답",
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
                        status: { type: "string", example: "CHALLENGING" },
                        startedAt: { type: "string", format: "date-time" },
                        missionId: { type: "number", example: 1 },
                        mission: {
                          type: "object",
                          properties: {
                            id: { type: "number", example: 1 },
                            title: { type: "string" },
                            description: { type: "string" },
                            rewardPoints: { type: "number", example: 100 },
                            startDate: { type: "string", format: "date-time", nullable: true },
                            endDate: { type: "string", format: "date-time", nullable: true },
                            isActive: { type: "boolean", example: true },
                            storeId: { type: "number", example: 1 },
                            store: {
                              type: "object",
                              properties: {
                                id: { type: "number", example: 1 },
                                name: { type: "string", example: "맛있는 떡볶이집" },
                                address: { type: "string", example: "서울시 강남구 ..." }
                              }
                            }
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

export const handleCompleteMyMission = async (req, res, next) => {
  try {
    const missionId = Number(req.params.missionId);
    const userId = req.user.id;
    const result = await completeMyMission({ missionId, userId });
    return res.status(StatusCodes.OK).success({
      message: "미션이 진행 완료로 변경되었습니다.",
      challenge: result,
    });
  } catch (e) {
    return next(e);
  }
  /*
    #swagger.summary = '내 진행 중 미션 완료 처리 API'
    #swagger.parameters['missionId'] = {
      in: 'path',
      required: true,
      description: '완료 처리할 미션 ID',
      schema: { type: 'number', example: 1 }
    }
    #swagger.responses[200] = {
      description: "미션 완료 처리 성공 응답",
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
                  message: {
                    type: "string",
                    example: "미션이 진행 완료로 변경되었습니다."
                  },
                  challenge: {
                    type: "object",
                    properties: {
                      id: { type: "number", example: 1 },
                      userId: { type: "number", example: 1 },
                      missionId: { type: "number", example: 1 },
                      status: { type: "string", example: "COMPLETED" },
                      startedAt: { type: "string", format: "date-time" },
                      completedAt: { type: "string", format: "date-time" }
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
      description: "사용자 없음 또는 진행 중인 미션이 아님/존재하지 않음",
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
                    description: "U404(사용자 없음), NOT_FOUND(진행 중 미션 아님) 등"
                  },
                  reason: {
                    type: "string",
                    example: "진행 중인 미션이 아니거나 존재하지 않습니다."
                  },
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
