import dotenv from "dotenv";
import cors from 'cors';
import express from "express";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleAddStoreToRegion, handleListStoreReviews } from "./controllers/store.controller.js";
import { handleAddReviewToStore, handleListMyReviews } from "./controllers/review.controller.js";
import { handleListStoreMissions, handleAddMissionToStore, handleChallengeMission, handleListMyChallengingMissions, handleCompleteMyMission } from "./controllers/mission.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/v1/users/signup", handleUserSignUp);

// 1-1 특정 지역에 가게 추가
app.post("/api/regions/:regionId/stores", handleAddStoreToRegion);

// 1-2 가게에 리뷰 추가 (가게 존재 검증)
app.post("/api/stores/:storeId/reviews", handleAddReviewToStore);

// 1-3 가게에 미션 추가
app.post("/api/stores/:storeId/missions", handleAddMissionToStore);

// 1-4 미션 도전하기 (중복 도전 검증)
app.post("/api/missions/:missionId/challenge", handleChallengeMission);

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

/*
const isLogin = (req, res, next) => {
    // cookie-parser가 만들어준 req.cookies 객체에서 username을 확인
    const { username } = req.cookies; 

    if (username) {
     
        console.log(`[인증 성공] ${username}님, 환영합니다.`);
        next(); 
    } else {
    
        console.log('[인증 실패] 로그인이 필요합니다.');
        res.status(401).send('<script>alert("로그인이 필요합니다!");location.href="/login";</script>');
    }
};


app.get('/', (req, res) => {
    res.send(`
        <h1>메인 페이지</h1>
        <p>이 페이지는 로그인이 필요 없습니다.</p>
        <ul>
            <li><a href="/mypage">마이페이지 (로그인 필요)</a></li>
        </ul>
    `);
});


app.get('/login', (req, res) => {
    res.send('<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>');
});


app.get('/mypage', isLogin, (req, res) => {
    res.send(`
        <h1>마이페이지</h1>
        <p>환영합니다, ${req.cookies.username}님!</p>
        <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
    `);
});


app.get('/set-login', (req, res) => {
    res.cookie('username', 'UMC9th', { maxAge: 3600000 });
    res.send('로그인 쿠키(username=UMC9th) 생성 완료! <a href="/mypage">마이페이지로 이동</a>');
});


app.get('/set-logout', (req, res) => {
    res.clearCookie('username');
    res.send('로그아웃 완료 (쿠키 삭제). <a href="/">메인으로</a>');
});
*/