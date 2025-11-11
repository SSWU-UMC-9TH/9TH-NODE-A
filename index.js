import 'dotenv/config'; 
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import prisma from "./src/db.config.js";


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); 
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(`[IN] ${req.method} ${req.url}`);
  next();
});


// 라우터 파일들을 가져옵니다. (경로 확인 필수: './src/routes/' 폴더를 가정)
import storeRouter from './src/routes/store.router.js'; 
import userRouter from './src/routes/user.router.js'; 


app.use('/api/v1', userRouter);
app.use('/api/v1', storeRouter);


app.use((err, req, res, next) => {
    console.error('--- EXPRESS ERROR HANDLER ---');
    console.error(err); 
    console.error('-----------------------------');

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