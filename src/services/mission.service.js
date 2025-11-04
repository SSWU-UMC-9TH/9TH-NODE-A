import * as MissionRepo from '../repositories/mission.repository.js';

/**
 * 미션 도전을 시작하는 서비스 로직
 * @param {number} userId
 * @param {number} missionId
 * @returns {number} challengeId
 * @throws {Error} 이미 도전 중일 경우 (M409)
 */
export const challengeMission = async (userId, missionId) => {
    // 1. 중복 도전 검증
    const isChallenged = await MissionRepo.isMissionAlreadyChallenged(userId, missionId);
    
    if (isChallenged) {
        // 이미 도전 중인 경우, 409 Conflict 오류 코드를 포함하여 에러를 던집니다.
        throw new Error("M409: 이미 도전 중인 미션입니다.");
    }

    // 2. 미션 도전 시작 (DB에 기록)
    const challengeId = await MissionRepo.startNewChallenge(userId, missionId);
    
    return challengeId;
};