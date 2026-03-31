import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
dotenv.config();

import {
  createStore,
  createReview,
  linkMission,
  challengeMission,
} from "./controllers/store.controller.js";

import {
  getMyReviews,
  getStoreMissions,
  getMyInProgressMissions,
  completeMission,
} from "./controllers/user.controller.js";

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

// 공통 응답 헬퍼 등록
app.use((req, res, next) => {
  res.success = (success) =>
    res.json({ resultType: "SUCCESS", error: null, success });

  res.error = ({ errorCode = "unknown", reason = null, data = null }) =>
    res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });

  next();
});

// 공용 미들웨어
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Swagger UI 세팅
app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(
    {},
    {
      swaggerOptions: {
        url: "/openapi.json",
      },
    }
  )
);

// Swagger 문서 JSON 동적 생성
app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true   // 이 라우트는 Swagger 목록에서 숨김
  try {
    const options = {
      openapi: "3.0.0",
      disableLogs: true,
      writeOutputFile: false,
    };
    const outputFile = "/dev/null"; // 실제 파일은 생성 안 함
    const routes = ["./src/index.js"]; // 라우트 정의가 들어있는 파일
    const doc = {
      info: {
        title: "UMC Week6/7/8 API",
        description: "UMC 9th Node.js + Prisma 테스트 프로젝트입니다.",
      },
      host: "localhost:3001", // 사용 중인 포트
    };

    const result = await swaggerAutogen(options)(outputFile, routes, doc);
    res.json(result ? result.data : null);
  } catch (err) {
    next(err);
  }
});

// 기본 라우트
app.get("/", (req, res) => res.send("UMC Week6"));

// (Week5 → Prisma로 치환한 API)
app.post("/api/v1/regions/:regionId/stores", createStore); // 1-1
app.post("/api/v1/stores/:storeId/reviews", createReview); // 1-2
app.post("/api/v1/stores/:storeId/missions", linkMission); // 1-3
app.post("/api/v1/missions/:missionId/challenge", challengeMission); // 1-4

// API 엔드포인트
app.get("/api/v1/users/:userId/reviews", getMyReviews);
app.get("/api/v1/stores/:storeId/missions", getStoreMissions);
app.get("/api/v1/users/:userId/missions/in-progress", getMyInProgressMissions);
app.patch(
  "/api/v1/users/:userId/missions/:missionId/complete",
  completeMission
);

// 전역 에러 핸들러 (공통 FAIL 포맷으로)
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

// 서버 실행
app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
