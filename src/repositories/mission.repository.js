import { pool } from "../db.config.js";

export const createMission = async ({ storeId, title, description, rewardPoints, startDate, endDate, isActive }) => {
  const conn = await pool.getConnection();
  try {
    const [res] = await conn.query(
      `INSERT INTO mission (store_id, title, description, reward_points, start_date, end_date, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [storeId, title, description, rewardPoints, startDate, endDate, isActive ? 1 : 0]
    );
    const [rows] = await conn.query("SELECT * FROM mission WHERE id = ?", [res.insertId]);
    return rows[0];
  } finally {
    conn.release();
  }
};

export const findMissionById = async (missionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("SELECT * FROM mission WHERE id = ?", [missionId]);
    return rows[0] || null;
  } finally {
    conn.release();
  }
};

export const isAlreadyChallenging = async ({ userId, missionId }) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT 1 FROM user_mission_challenge
       WHERE user_id = ? AND mission_id = ? AND status = 'CHALLENGING'`,
      [userId, missionId]
    );
    return rows.length > 0;
  } finally {
    conn.release();
  }
};

export const createUserMissionChallenge = async ({ userId, missionId }) => {
  const conn = await pool.getConnection();
  try {
    const [res] = await conn.query(
      `INSERT INTO user_mission_challenge (user_id, mission_id, status)
       VALUES (?, ?, 'CHALLENGING')`,
      [userId, missionId]
    );
    const [rows] = await conn.query("SELECT * FROM user_mission_challenge WHERE id = ?", [res.insertId]);
    return rows[0];
  } finally {
    conn.release();
  }
};
