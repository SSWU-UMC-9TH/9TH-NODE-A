import { StatusCodes } from "http-status-codes";
import * as MissionService from '../services/mission.service.js';

/**
 * 미션 도전하기 API 핸들러
 * POST /api/v1/users/:userId/challenges
 */
export const handleChallengeMission = async (req, res, next) => {
    // URL 파라미터에서 userId를 가져옵니다. (라우터에서 :userId로 정의됨)
    const userId = parseInt(req.params.userId); 
    // 요청 본문에서 mission_id를 가져옵니다.
    const { mission_id } = req.body; 
    
    try {
        const challengeId = await MissionService.challengeMission(userId, mission_id);

        res.status(StatusCodes.CREATED).json({ // 201 Created
            "success": true,
            "code": "S201",
            "message": "미션 도전이 시작되었습니다.",
            "data": {
                "challenge_id": challengeId,
                "user_id": userId
            }
        });
    } catch (error) {
        // M409 중복 오류 처리 (409 Conflict)
        if (error.message.startsWith("M409")) {
            return res.status(StatusCodes.CONFLICT).json({ 
                "success": false,
                "code": "M409",
                "message": "이미 도전 중인 미션입니다."
            });
        }
        // 그 외 서버 오류는 최종 에러 핸들러로 전달
        next(error); 
    }
};

export const handleAddMission = async (req, res, next) => {
    const storeId = parseInt(req.params.storeId);
    const missionData = req.body; // 미션 정보 (name, points, deadline 등)

    try {
        // MissionService에 미션 추가 로직이 있다고 가정
        const missionId = await MissionService.addMissionToStore(storeId, missionData); 

        res.status(StatusCodes.CREATED).json({
            "success": true,
            "code": "S201",
            "message": "미션이 성공적으로 등록되었습니다.",
            "data": {
                "mission_id": missionId,
                "store_id": storeId
            }
        });
    } catch (error) {
         // 가게 존재하지 않음 (M404) 또는 다른 유효성 검증 오류 처리
        if (error.message.startsWith("M404")) {
            return res.status(StatusCodes.NOT_FOUND).json({
                "success": false,
                "code": "M404",
                "message": "해당 가게를 찾을 수 없습니다."
            });
        }
        next(error);
    }
};