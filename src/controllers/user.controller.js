import { StatusCodes } from "http-status-codes";
import { signUpUser, getReviewsByUserId, isUserExist } from "../services/user.service.js";
import { ApiResponse } from "../responses/ApiResponse.js";
import { NotFoundError, BadRequestError, ConflictError } from "../errors/CustomError.js";

// 회원가입
export const handleUserSignUp = async (req, res, next) => {

  const newUser = await signUpUser(req.body);

  const response = ApiResponse(
    StatusCodes.CREATED,
    "S201",
    "회원가입이 완료되었습니다.",
    {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }
  );
  return res.status(response.status).json(response.body);
};

// 사용자 작성 리뷰 목록 조회
export const handleGetUserReviews = async (req, res, next) => {

    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    // 입력값 유효성 검사 (page, size는 양수)
    if (page < 1 || size < 1) {
        throw new BadRequestError("페이지 번호와 크기는 1 이상이어야 합니다.");
    }

    if (!(await isUserExist(userId))) {
        throw new NotFoundError("사용자를 찾을 수 없습니다.", { internal_code: "M404" });
    }


    const reviews = await getReviewsByUserId(userId, { page, size });

    const response = ApiResponse(
        StatusCodes.OK,
        "S200",
        "사용자 리뷰 목록 조회 성공",
        reviews
    );
    return res.status(response.status).json(response.body);
};