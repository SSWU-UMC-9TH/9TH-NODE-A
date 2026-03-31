import express from 'express';

import { handleAddStore, handleAddReview, handleGetStoreMissions, handleAddRegion } from '../controllers/store.controller.js'; 
import { handleAddMission } from '../controllers/mission.controller.js'; // 미션 추가는 mission controller에 있을 수도 있음

const storeRouter = express.Router();

// --- /regions 라우팅 ---
// 지역 추가
storeRouter.post('/regions', handleAddRegion);
// 최종 경로: POST /api/v1/regions/:regionId/stores
storeRouter.post('/regions/:regionId/stores', handleAddStore); 

// --- /stores 라우팅 ---
// 최종 경로: POST /api/v1/stores/:storeId/reviews
storeRouter.post('/stores/:storeId/reviews', handleAddReview);

// 최종 경로: POST /api/v1/stores/:storeId/missions
storeRouter.post('/stores/:storeId/missions', handleAddMission);

// GET: /api/v1/stores/:storeId/missions 누락된 미션 목록 조회
storeRouter.get('/stores/:storeId/missions', handleGetStoreMissions);

export default storeRouter;