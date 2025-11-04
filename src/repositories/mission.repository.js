import { pool } from "../db.config.js";

/**
 * 해당 미션을 사용자가 이미 도전 중인지 확인합니다.
 * @param {number} userId
 * @param {number} missionId
 * @returns {boolean} 도전 중인 경우 true
 */
export const isMissionAlreadyChallenged = async (userId, missionId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            "SELECT 1 FROM user_mission WHERE user_id = ? AND mission_id = ? AND status = 'DOING';",
            [userId, missionId]
        );
        return rows.length > 0;
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
};

/**
 * 새로운 미션 도전을 기록합니다.
 * @param {number} userId
 * @param {number} missionId
 * @returns {number} 삽입된 도전 ID (challenge_id)
 */
export const startNewChallenge = async (userId, missionId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(
            "INSERT INTO user_mission (user_id, mission_id, status) VALUES (?, ?, 'DOING');",
            [userId, missionId]
        );
        return result.insertId;
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
};