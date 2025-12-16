import { pool } from "../db.config.js";

// 1-1 지역 존재 확인 + 가게 추가
export const existsRegion = async (regionId) => {
  const [rows] = await pool.query("SELECT 1 FROM app_regions WHERE id=?", [
    regionId,
  ]);
  return rows.length > 0;
};
export const insertStore = async ({ regionId, name, address }) => {
  const [res] = await pool.query(
    "INSERT INTO app_stores (region_id, name, address) VALUES (?, ?, ?)",
    [regionId, name, address]
  );
  return res.insertId;
};

// 1-2 가게/유저 존재 확인 + 리뷰 추가
export const existsStore = async (storeId) => {
  const [rows] = await pool.query("SELECT 1 FROM app_stores WHERE id=?", [
    storeId,
  ]);
  return rows.length > 0;
};
export const existsUser = async (userId) => {
  const [rows] = await pool.query("SELECT 1 FROM app_users WHERE id=?", [
    userId,
  ]);
  return rows.length > 0;
};
export const insertReview = async ({ storeId, userId, content, rating }) => {
  const [res] = await pool.query(
    "INSERT INTO app_reviews (store_id, user_id, content, rating) VALUES (?, ?, ?, ?)",
    [storeId, userId, content, rating]
  );
  return res.insertId;
};

// 1-3 가게/미션 존재 + 매핑
export const existsMission = async (missionId) => {
  const [rows] = await pool.query("SELECT 1 FROM app_missions WHERE id=?", [
    missionId,
  ]);
  return rows.length > 0;
};
export const existsStoreMission = async (storeId, missionId) => {
  const [rows] = await pool.query(
    "SELECT 1 FROM app_store_missions WHERE store_id=? AND mission_id=?",
    [storeId, missionId]
  );
  return rows.length > 0;
};
export const insertStoreMission = async ({ storeId, missionId }) => {
  const [res] = await pool.query(
    "INSERT INTO app_store_missions (store_id, mission_id) VALUES (?, ?)",
    [storeId, missionId]
  );
  return res.insertId;
};

// 1-4 미션 도전
export const existsUserMission = async (userId, missionId) => {
  const [rows] = await pool.query(
    "SELECT 1 FROM app_user_missions WHERE user_id=? AND mission_id=?",
    [userId, missionId]
  );
  return rows.length > 0;
};
export const insertUserMission = async ({ userId, missionId }) => {
  const [res] = await pool.query(
    "INSERT INTO app_user_missions (user_id, mission_id) VALUES (?, ?)",
    [userId, missionId]
  );
  return res.insertId;
};
