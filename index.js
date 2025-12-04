import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import Prisma from "./src/db.config.js";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import passport from "passport";
import { googleStrategy, jwtStrategy } from "./src/auth.config.js";


import 'dotenv/config';

passport.use(googleStrategy);
passport.use(jwtStrategy);

const app = express();
const port = process.env.PORT || 3000;

const isLogin = passport.authenticate('jwt', { session: false });

app.use(morgan('dev'));

app.use(express.json());
app.use(cors());
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use(cookieParser());
app.get('/test', isLogin, (req, res) => {
    return res.status(200).json({
        success: true,
        message: `인증 성공! ${req.user.name}님의 테스트 라우트입니다.`,
        user: req.user,
    });
});
app.use(
    "/docs/",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(null, {
        swaggerOptions: {
            url: "/openapi.json",
        },
    })
);

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

app.get("/openapi.json", async (req, res, next) => {
    // #swagger.ignore = true
    try {
        const options = {
            openapi: "3.0.0",
            disableLogs: true,
            writeOutputFile: false,
        };
        const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
        const routes = ["./index.js", "./src/routes/store.router.js", "./src/routes/user.router.js"];
        const doc = {
            info: {
                title: "UMC 9th",
                description: "UMC 9th Node.js 테스트 프로젝트입니다.",
            },
            host: "localhost:3000",
        };

        const generate = swaggerAutogen(options);
        const result = await generate(outputFile, routes, doc);
        const spec = result?.data || result;
        return res.json(spec);
    } catch (err) {
        console.error("Swagger 생성 오류:", err);
        next(err);
    }
});


import storeRouter from './src/routes/store.router.js';
import userRouter from './src/routes/user.router.js';


app.use('/api/v1/users', userRouter);
app.use('/api/v1', storeRouter);

import { CustomError } from './src/errors/CustomError.js';

app.use((err, req, res, next) => {
    console.error('--- EXPRESS ERROR HANDLER ---');
    console.error(err);
    console.error('-----------------------------');

    if (err instanceof CustomError) {
        return res.status(err.status).json({
            success: false,
            code: err.code,
            message: err.message,
            data: err.data || null
        });
    }
    return res.status(500).json({
        success: false,
        code: "G500",
        message: "서버 내부 오류 발생. 관리자에게 문의하세요."
    });
});


// --- 서버 시작 ---

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});