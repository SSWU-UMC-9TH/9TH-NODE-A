import dotenv from "dotenv";
import cors from 'cors';
import express from "express";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";

import passport from "passport";
import { googleStrategy, jwtStrategy } from "./auth.config.js";
import { prisma } from "./db.config.js";

dotenv.config();

passport.use(googleStrategy);
passport.use(jwtStrategy); 

const app = express();
const port = process.env.PORT;

/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});


app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

// morgan과 cookie-parser 미들웨어 등록
app.use(morgan('dev'));       
app.use(cookieParser());    

app.use(passport.initialize());

const isLogin = passport.authenticate('jwt', { session: false });

// 컨트롤러 import
import { handleUserSignUp, handleUpdateMyProfile } from "./controllers/user.controller.js";
import { handleAddStoreToRegion, handleListStoreReviews } from "./controllers/store.controller.js";
import { handleAddReviewToStore, handleListMyReviews } from "./controllers/review.controller.js";
import {
  handleListStoreMissions,
  handleAddMissionToStore,
  handleChallengeMission,
  handleListMyChallengingMissions,
  handleCompleteMyMission,
} from "./controllers/mission.controller.js";


// 회원가입 API
app.post("/api/v1/users/signup", handleUserSignUp);

// 내 정보 수정 (로그인 필요)
app.patch("/api/v1/users/me", isLogin, handleUpdateMyProfile);

// 1-1 특정 지역에 가게 추가
app.post("/api/regions/:regionId/stores", isLogin, handleAddStoreToRegion);

// 1-2 가게에 리뷰 추가 (가게 존재 검증)
app.post("/api/stores/:storeId/reviews", isLogin, handleAddReviewToStore);

// 1-3 가게에 미션 추가
app.post("/api/stores/:storeId/missions", isLogin, handleAddMissionToStore);

// 1-4 미션 도전하기 (중복 도전 검증)
app.post("/api/missions/:missionId/challenge", isLogin, handleChallengeMission);

// 가게에 속한 모든 리뷰를 조회 (로그인 불필요)
app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);


// 내가 작성한 리뷰 목록
app.get("/api/me/reviews", isLogin, handleListMyReviews);

// 특정 가게의 미션 목록 (로그인 불필요)
app.get("/api/stores/:storeId/missions", handleListStoreMissions);

// 내가 진행 중인 미션 목록
app.get("/api/me/missions/challenging", isLogin, handleListMyChallengingMissions);

// 내가 진행 중인 미션을 진행 완료로 바꾸기
app.patch("/api/me/missions/:missionId/complete", isLogin, handleCompleteMyMission);

/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Google OAuth2.0 로그인 시작점
app.get("/oauth2/login/google", 
  passport.authenticate("google", { 
    session: false 
  })
);
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
	  session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    const tokens = req.user; 

    res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: {
          message: "Google 로그인 성공!",
          tokens: tokens, // { "accessToken": "...", "refreshToken": "..." }
      }
    });
  }
);

app.get('/mypage', isLogin, (req, res) => {
  res.status(200).success({
    message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
    user: req.user,
  });
});


// Swagger 자동 생성기 설정
app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 9th",
      description: "UMC 9th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});
