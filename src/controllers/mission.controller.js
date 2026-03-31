import { StatusCodes } from "http-status-codes";
import * as MissionService from '../services/mission.service.js';
import { ApiResponse } from "../responses/ApiResponse.js";
import { NotFoundError, BadRequestError, ConflictError } from "../errors/CustomError.js";

export const handleChallengeMission = async (req, res, next) => {

    const userId = parseInt(req.params.userId, 10);
    const missionId = parseInt(req.body.mission_id, 10);

    if (Number.isNaN(userId) || Number.isNaN(missionId)) {
        throw new BadRequestError("유효한 사용자 ID와 미션 ID가 필요합니다.");
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