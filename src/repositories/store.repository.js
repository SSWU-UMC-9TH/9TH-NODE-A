import { pool } from "../db.config.js";

/**
 * 특정 지역 ID가 존재하는지 확인
 */
export const isRegionExist = async (regionId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            "SELECT 1 FROM region WHERE id = ?;",
            [regionId]
        );
        return rows.length > 0;
    } finally {
        conn.release();
    }
};

/**
 * 특정 가게 ID가 존재하는지 확인
 */
export const isStoreExist = async (storeId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            "SELECT 1 FROM store WHERE id = ?;",
            [storeId]
        );
        return rows.length > 0;
    } finally {
        conn.release();
    }
};

/**
 * 가게 정보 삽입
 */
export const insertStore = async (regionId, storeData) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(
            "INSERT INTO store (region_id, name, address, category_id, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?);",
            [
                regionId, 
                storeData.name, 
                storeData.address, 
                storeData.category_id, 
                storeData.latitude, 
                storeData.longitude
            ]
        );
        return result.insertId;
    } finally {
        conn.release();
    }
};

/**
 * 리뷰 삽입 (review 테이블 구조 반영: mission_id NOT NULL 가정)
 */
export const insertReview = async (storeId, userId, missionId, rating, content) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(
            "INSERT INTO review (store_id, user_id, mission_id, rating, content) VALUES (?, ?, ?, ?, ?);",
            [storeId, userId, missionId, rating, content] 
        );
        return result.insertId;
    } finally {
        conn.release();
    }
};