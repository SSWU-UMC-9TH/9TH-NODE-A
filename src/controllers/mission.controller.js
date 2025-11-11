import { StatusCodes } from "http-status-codes";
import {
  addMissionToStore,
  challengeMission,
  listStoreMissions,
  listMyChallengingMissions,
  completeMyMission,
} from "../services/mission.service.js";

export const handleAddMissionToStore = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    const result = await addMissionToStore({ storeId, body: req.body });
    return res.status(StatusCodes.CREATED).success(result);
  } catch (e) {
    return next(e);
  }
};

export const handleChallengeMission = async (req, res, next) => {
  try {
    const missionId = Number(req.params.missionId);
    const result = await challengeMission({ missionId });
    return res.status(StatusCodes.CREATED).success(result);
  } catch (e) {
    return next(e);
  }
};

export const handleListStoreMissions = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    const activeParam = typeof req.query.active === "string" ? req.query.active : null;
    const onlyActive = activeParam === null ? null : activeParam === "true";
    const cursor = Number.isFinite(Number(req.query?.cursor)) ? Number(req.query.cursor) : 0;
    const take   = Number.isFinite(Number(req.query?.take))   ? Number(req.query.take)   : 5;

    const result = await listStoreMissions(storeId, onlyActive, cursor, take);
    return res.status(StatusCodes.OK).success(result);
  } catch (e) {
    return next(e);
  }
};

export const handleListMyChallengingMissions = async (req, res, next) => {
  try {
    const cursor = Number.isFinite(Number(req.query?.cursor)) ? Number(req.query.cursor) : 0;
    const take   = Number.isFinite(Number(req.query?.take))   ? Number(req.query.take)   : 5;
    const result = await listMyChallengingMissions(cursor, take, undefined);
    return res.status(StatusCodes.OK).success(result);
  } catch (e) {
    return next(e);
  }
};

export const handleCompleteMyMission = async (req, res, next) => {
  try {
    const missionId = Number(req.params.missionId);
    const result = await completeMyMission({ missionId, userIdFromReq: undefined });
    return res.status(StatusCodes.OK).success({
      message: "미션이 진행 완료로 변경되었습니다.",
      challenge: result,
    });
  } catch (e) {
    return next(e);
  }
};
