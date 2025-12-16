import 'dotenv/config'; //환경 변수를 서버 최상단에서 로드합니다.
import express from 'express';
import cors from 'cors';

// 라우터 파일들을 가져옵니다. (경로 확인 필수: './src/routes/' 폴더를 가정)
import storeRouter from './src/routes/store.router.js'; 
import userRouter from './src/routes/user.router.js'; 

const app = express();
const port = process.env.PORT || 3000;

// --- 미들웨어 설정 ---

app.use(express.json()); // JSON 형태의 요청 본문(req.body) 파싱
app.use(cors());
app.use(express.urlencoded({ extended: false }));


// --- 라우터 연결 (API Path 설계 반영) ---

// 1. 사용자 관련 API 연결 (회원가입, 미션 도전)
// 최종 경로: POST /api/v1/users/signup, POST /api/v1/users/:userId/challenges
app.use('/api/v1/users', userRouter); 

// 2. 가게 및 지역 관련 API 연결 (가게 추가, 리뷰 추가, 미션 추가)
// 최종 경로: POST /api/v1/regions/1/stores
app.use('/api/v1/regions', storeRouter); 

// 최종 경로: POST /api/v1/stores/1/reviews
app.use('/api/v1/stores', storeRouter); 


// --- 에러 핸들러 (최종 미들웨어) ---

app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).json({
        success: false,
        code: "G500",
        message: "서버 내부 오류 발생. 관리자에게 문의하세요.",
    });
});


// --- 서버 시작 ---

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});