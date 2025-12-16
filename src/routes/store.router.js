import express from 'express';
// Controller 함수들을 가져옵니다. (store.controller.js 파일에 모두 있다고 가정)
import { handleAddStore, handleAddReview } from '../controllers/store.controller.js'; 
import { handleAddMission } from '../controllers/mission.controller.js'; // 미션 추가는 mission controller에 있을 수도 있음

const storeRouter = express.Router();

// --- /regions 라우팅 ---
// 최종 경로: POST /api/v1/regions/:regionId/stores
storeRouter.post('/:regionId/stores', handleAddStore); 

// --- /stores 라우팅 ---
// 최종 경로: POST /api/v1/stores/:storeId/reviews
storeRouter.post('/:storeId/reviews', handleAddReview);

// 최종 경로: POST /api/v1/stores/:storeId/missions
storeRouter.post('/:storeId/missions', handleAddMission);

export default storeRouter;