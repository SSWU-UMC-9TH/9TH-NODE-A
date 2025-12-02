import express from "express";
import passport from "passport";

// Controller 함수들
import {
    handleUserSignUp,
    handleGetUserReviews,
} from "../controllers/user.controller.js";
import { handleChallengeMission } from "../controllers/mission.controller.js";

const router = express.Router();

// JWT 보호 미들웨어
const isLogin = passport.authenticate("jwt", { session: false });

// --- /api/v1/users 라우팅 ---

// 1. 회원 가입 API: POST /api/v1/users/signup
router.post("/signup", handleUserSignUp);

// 2. 미션 도전하기 API: POST /api/v1/users/challenges
router.post("/challenges", handleChallengeMission);

// 3. 사용자 작성 리뷰 목록 조회: GET /api/v1/users/:userId/reviews
router.get("/:userId/reviews", handleGetUserReviews);

// 4. 마이페이지 (JWT 보호 라우트): GET /api/v1/users/mypage
router.get("/mypage", isLogin, (req, res) => {
    return res.status(200).json({
        success: true,
        message: `인증 성공! ${req.user.name || req.user.email}님의 마이페이지입니다.`,
        user: req.user,
    });
});

export default router;