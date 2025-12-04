import { StatusCodes } from "http-status-codes";
import * as MissionService from '../services/mission.service.js';
import { ApiResponse } from "../responses/ApiResponse.js";
import { NotFoundError, BadRequestError, ConflictError } from "../errors/CustomError.js";

export const handleChallengeMission = async (req, res, next) => {

    /*
    #swagger.tags = ['Mission']
    #swagger.summary = '미션 도전 시작 API'
    #swagger.description = '사용자(userId)가 특정 미션(mission_id)에 도전하는 요청입니다.'

    #swagger.parameters['userId'] = {
      in: 'path',
      required: true,
      description: '미션에 도전하는 사용자 ID',
      schema: { type: 'integer', example: 3 }
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              mission_id: {
                type: "integer",
                example: 10,
                description: "도전할 미션 ID"
              }
            },
            required: ["mission_id"]
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "미션 도전 시작 성공",
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
                      challenge_id: { type: "integer", example: 101 },
                      user_id: { type: "integer", example: 3 }
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
      description: "유효하지 않은 userId 또는 mission_id",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                example: {
                  code: "B400",
                  message: "유효한 사용자 ID와 미션 ID가 필요합니다."
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "존재하지 않는 미션 또는 사용자 등",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                example: {
                  code: "M404",
                  message: "해당 미션 또는 사용자를 찾을 수 없습니다."
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */

    const userId = req.user.id;
    const missionId = parseInt(req.body.mission_id, 10);

    if (Number.isNaN(missionId)) {
        throw new BadRequestError("유효한 미션 ID가 필요합니다.");
    }

    const challengeId = await MissionService.challengeMission(userId, missionId);

    const response = ApiResponse(
        StatusCodes.CREATED,
        "S201",
        "미션 도전이 시작되었습니다.",
        {
            "challenge_id": challengeId,
            "user_id": userId
        }
    );
    return res.status(response.status).json(response.body);
};

export const handleAddMission = async (req, res) => {
    /*
    #swagger.tags = ['Mission']
    #swagger.summary = '가게 미션 등록 API'
    #swagger.description = '특정 가게(storeId)에 새로운 미션을 등록합니다.'

    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      description: '미션을 등록할 가게 ID',
      schema: { type: 'integer', example: 1 }
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              title:        { type: "string", example: "첫 방문 인증하고 리뷰 남기기" },
              description:  { type: "string", example: "처음 방문 후 사진과 함께 리뷰를 작성하면 포인트 지급" },
              reward_point: { type: "integer", example: 500 },
              due_date:     { type: "string", format: "date-time", example: "2025-12-31T23:59:59" }
            },
            required: ["title"]
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "미션 등록 성공",
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
                      mission_id: { type: "integer", example: 20 },
                      store_id:   { type: "integer", example: 1 }
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
      description: "유효하지 않은 storeId 또는 미션 제목 누락",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                example: {
                  code: "B400",
                  message: "유효한 가게 ID와 미션 제목이 필요합니다."
                }
              },
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
              error: {
                type: "object",
                example: {
                  code: "M404",
                  message: "해당 가게를 찾을 수 없습니다."
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
    const storeId = parseInt(req.params.storeId, 10);
    const missionData = req.body;

    if (Number.isNaN(storeId) || !missionData?.title) {
        throw new BadRequestError("유효한 가게 ID와 미션 제목이 필요합니다.");
    }

    try {
        const missionId = await MissionService.addMissionToStore(storeId, missionData);

        const response = ApiResponse(
            StatusCodes.CREATED,
            "S201",
            "미션이 성공적으로 등록되었습니다.",
            {
                "mission_id": missionId,
                "store_id": storeId
            }
        );
        return res.status(response.status).json(response.body);

    } catch (error) {
        if (String(error.message).startsWith("M404")) {
            throw new NotFoundError("해당 가게를 찾을 수 없습니다.", { internal_code: "M404" });
        }
        throw (error);
    }
};