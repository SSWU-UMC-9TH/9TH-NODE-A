import { StatusCodes } from "http-status-codes";
import { signUpUser, getReviewsByUserId, isUserExist } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  try {
    const newUser = await signUpUser(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      code: "S201",
      message: "회원가입이 완료되었습니다.",
      data: {
        id: newUser.id,          // user_id 아님
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    // Prisma의 중복 에러(P2002)나 커스텀 에러 메시지 모두 처리
    if (error.code === "P2002" || String(error.message).startsWith("M409")) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        code: "M409",
        message: "이미 존재하는 이메일입니다.",
      });
    }
    next(error);
  }
};

// 사용자 작성 리뷰 목록 조회
export const handleGetUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;

    console.log(`[DEBUG] Received userId: ${userId}`);

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    // 입력값 유효성 검사 (page, size는 양수)
    if (page < 1 || size < 1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        code: "M400",
        message: "페이지 번호와 크기는 1 이상이어야 합니다.",
      });
    }

    const reviews = await getReviewsByUserId(userId, { page, size });

    res.status(StatusCodes.OK).json({
      success: true,
      code: "S200",
      message: "사용자 리뷰 목록 조회 성공",
      data: reviews,
    });
  } catch (error) {
    if (String(error.message).startsWith("M404")) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        code: "M404",
        message: "사용자를 찾을 수 없습니다.",
      });
    }
    next(error);
  }
};