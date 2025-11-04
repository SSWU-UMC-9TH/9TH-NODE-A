import { StatusCodes } from "http-status-codes";
import { addMissionToStore, challengeMission, listStoreMissions, listMyChallengingMissions } from "../services/mission.service.js";
import { completeMyMission } from "../services/mission.service.js";

export const handleAddMissionToStore = async (req, res) => {
  try {
    const storeId = Number(req.params.storeId);
    const result = await addMissionToStore({ storeId, body: req.body });
    res.status(StatusCodes.CREATED).json({ result });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: e.message });
  }
};

export const handleChallengeMission = async (req, res) => {
  try {
    const missionId = Number(req.params.missionId);
    const result = await challengeMission({ missionId });
    res.status(StatusCodes.CREATED).json({ result });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: e.message });
  }
};

export const handleListStoreMissions = async (req, res) => {
  try {
    const storeId = Number(req.params.storeId);
    const activeParam = typeof req.query.active === "string" ? req.query.active : null;
    const onlyActive = activeParam === null ? null : activeParam === "true";
    const cursor = Number.isFinite(Number(req.query?.cursor)) ? Number(req.query.cursor) : 0;
    const take   = Number.isFinite(Number(req.query?.take))   ? Number(req.query.take)   : 5;

    const result = await listStoreMissions(storeId, onlyActive, cursor, take);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const handleListMyChallengingMissions = async (req, res) => {
  try {
    const cursor = Number.isFinite(Number(req.query?.cursor)) ? Number(req.query.cursor) : 0;
    const take   = Number.isFinite(Number(req.query?.take))   ? Number(req.query.take)   : 5;

    const result = await listMyChallengingMissions(cursor, take, undefined);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const handleCompleteMyMission = async (req, res) => {
  try {
    const missionId = Number(req.params.missionId);
    const result = await completeMyMission({ missionId, userIdFromReq: undefined });

    res.status(StatusCodes.OK).json({
      message: "미션이 진행 완료로 변경되었습니다.",
      challenge: result,
    });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: e.message });
  }
};