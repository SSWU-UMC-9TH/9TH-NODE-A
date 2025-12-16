import { pool } from "../db.config.js";

/**
 * 이메일이 이미 존재하는지 확인
 * @param {string} email
 * @returns {boolean} 존재 여부
 */
export const isEmailExist = async (email) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            // user 테이블의 PK가 user_id이므로, 이메일은 UNIQUE 제약 조건으로 확인
            "SELECT 1 FROM user WHERE email = ?;",
            [email]
        );
        return rows.length > 0;
    } finally {
        conn.release();
    }
};

/**
 * 사용자 데이터 삽입 (회원 가입)
 * @param {Object} userData - 회원가입 데이터 (이메일, 비밀번호 등)
 * @returns {number} 삽입된 사용자 ID (user_id)
 */
export const insertUser = async (userData) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(
            // user_id는 AUTO_INCREMENT이므로 생략하고, 비밀번호는 해시된 값을 사용한다고 가정
            "INSERT INTO user (email, password, nickname) VALUES (?, ?, ?);",
            [
                userData.email,
                userData.password_hash, // 해시된 비밀번호를 사용해야 함
                userData.name // 요청 바디의 name이 nickname 컬럼에 들어간다고 가정
            ]
        );
        return result.insertId;
    } finally {
        conn.release();
    }
};