import { StatusCodes } from "http-status-codes";
import { signUpUser } from '../services/user.service.js';
// import { responseFromUser } from '../dtos/user.dto.js'; // DTO 함수는 사용자 응답에 필요

/**
 * 회원 가입 API 핸들러
 * POST /api/v1/users/signup
 */
export const handleUserSignUp = async (req, res, next) => {
    // 요청 바디에서 모든 데이터를 가져옵니다.
    const userData = req.body; 
    
    try {
        // Service 호출 (이메일 중복 검증, 해싱, DB 삽입 포함)
        const newUserData = await signUpUser(userData);
        
        // DTO로 최종 응답 형식을 변환한다고 가정하고, 여기서는 직접 반환
        // const responseData = responseFromUser(newUserData, null); 

        res.status(StatusCodes.CREATED).json({ // 201 Created 사용
            "success": true,
            "code": "S201",
            "message": "회원가입이 완료되었습니다.",
            "data": {
                "id": newUserData.user_id,
                "name": newUserData.name
            }
        });
    } catch (error) {
        // M409 중복 오류 처리 (409 Conflict)
        if (error.message.startsWith("M409")) {
            return res.status(StatusCodes.CONFLICT).json({ 
                "success": false,
                "code": "M409",
                "message": "이미 존재하는 이메일입니다."
            });
        }
        // 그 외 서버 오류는 최종 에러 핸들러로 전달
        next(error); 
    }
};