import * as UserRepo from '../repositories/user.repository.js';
// import bcrypt from 'bcrypt'; // 비밀번호 해싱 라이브러리를 사용한다고 가정

const SALT_ROUNDS = 10; // 해싱 강도

/**
 * 회원 가입 서비스 로직
 * @param {Object} userData - 가입 요청 데이터
 * @returns {Object} 가입된 사용자 정보 DTO
 * @throws {Error} 이메일이 이미 존재할 경우
 */
export const signUpUser = async (userData) => {
    // 1. 이메일 중복 검증
    const exists = await UserRepo.isEmailExist(userData.email);
    if (exists) {
        throw new Error("M409: 이미 존재하는 이메일입니다.");
    }

    // 2. 비밀번호 해싱 (보안 필수)
    // const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    
    // 테스트를 위해 해싱 생략하고, 임시 해시 값 사용
    const hashedPassword = `hashed_${userData.password}`; 

    const dataToInsert = {
        email: userData.email,
        password_hash: hashedPassword,
        name: userData.user_name // 요청 바디의 user_name을 사용
    };

    // 3. 사용자 데이터 삽입 및 ID 획득
    const userId = await UserRepo.insertUser(dataToInsert);

    // 4. 응답 DTO를 위한 데이터 반환 (user.dto.js에서 사용할 정보)
    return {
        user_id: userId,
        name: userData.user_name
    };
};