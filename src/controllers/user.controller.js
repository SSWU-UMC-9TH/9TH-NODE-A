import { StatusCodes } from "http-status-codes";
import * as service from "../services/user.service.js";

export const getMyReviews = async (req, res, next) => {
  try {
    const data = await service.listMyReviews(Number(req.params.userId));
    res.status(StatusCodes.OK).json({ data });
  } catch (e) {
    next(e);
  }
};

export const getStoreMissions = async (req, res, next) => {
  try {
    const data = await service.listStoreMissions(Number(req.params.storeId));
    res.status(StatusCodes.OK).json({ data });
  } catch (e) {
    next(e);
  }
};

export const getMyInProgressMissions = async (req, res, next) => {
  try {
    const data = await service.listMyInProgressMissions(
      Number(req.params.userId)
    );
    res.status(StatusCodes.OK).json({ data });
  } catch (e) {
    next(e);
  }
};

export const completeMission = async (req, res, next) => {
  try {
    const result = await service.completeMyMission(
      Number(req.params.userId),
      Number(req.params.missionId)
    );
    res.status(StatusCodes.OK).json(result);
  } catch (e) {
    next(e);
  }
};
