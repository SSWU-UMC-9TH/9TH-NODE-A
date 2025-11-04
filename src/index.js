import dotenv from "dotenv";
import cors from 'cors';
import express from "express";
import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleAddStoreToRegion, handleListStoreReviews } from "./controllers/store.controller.js";
import { handleAddReviewToStore, handleListMyReviews } from "./controllers/review.controller.js";
import { handleListStoreMissions, handleAddMissionToStore, handleChallengeMission, handleListMyChallengingMissions, handleCompleteMyMission } from "./controllers/mission.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/members", handleUserSignUp);

// 1-1 특정 지역에 가게 추가
app.post("/api/regions/:regionId/stores", handleAddStoreToRegion);

// 1-2 가게에 리뷰 추가 (가게 존재 검증)
app.post("/api/stores/:storeId/reviews", handleAddReviewToStore);

// 1-3 가게에 미션 추가
app.post("/api/stores/:storeId/missions", handleAddMissionToStore);

// 1-4 미션 도전하기 (중복 도전 검증)
app.post("/api/missions/:missionId/challenge", handleChallengeMission);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// 가게에 속한 모든 리뷰를 조회
app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);


// 내가 작성한 리뷰 목록
app.get("/api/me/reviews", handleListMyReviews);

// 특정 가게의 미션 목록
app.get("/api/stores/:storeId/missions", handleListStoreMissions);

// 내가 진행 중인 미션 목록
app.get("/api/me/missions/challenging", handleListMyChallengingMissions);

// 내가 진행 중인 미션을 진행 완료로 바꾸기
app.patch("/api/me/missions/:missionId/complete", handleCompleteMyMission);
