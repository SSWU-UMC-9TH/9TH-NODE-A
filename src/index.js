import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message ?? "Bad Request" });
});

// 서버 실행
app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
