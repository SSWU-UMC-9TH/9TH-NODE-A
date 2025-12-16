import express from 'express';
// Controller 함수들을 가져옵니다.
import { handleUserSignUp } from '../controllers/user.controller.js'; 
import { handleChallengeMission } from '../controllers/mission.controller.js'; 

const userRouter = express.Router();

// --- /users 라우팅 ---

// 1. 회원 가입 API: POST /api/v1/users/signup
userRouter.post('/signup', handleUserSignUp); 

// 2. 미션 도전하기 API: POST /api/v1/users/:userId/challenges
userRouter.post('/:userId/challenges', handleChallengeMission); 

export default userRouter;