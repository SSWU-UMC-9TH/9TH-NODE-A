import { StatusCodes } from "http-status-codes";
import * as service from "../services/store.service.js";
import {
  toCreateStoreDto,
  toCreateReviewDto,
  toLinkMissionDto,
  toChallengeMissionDto,
} from "../dtos/store.dto.js";

export const createStore = async (req, res, next) => {
  try {
    const result = await service.createStore(
      toCreateStoreDto(req.params, req.body)
    );
    res.status(StatusCodes.CREATED).json(result);
  } catch (e) {
    next(e);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const result = await service.createReview(
      toCreateReviewDto(req.params, req.body)
    );
    res.status(StatusCodes.CREATED).json(result);
  } catch (e) {
    next(e);
  }
};

export const linkMission = async (req, res, next) => {
  try {
    const result = await service.linkMission(
      toLinkMissionDto(req.params, req.body)
    );
    res.status(StatusCodes.CREATED).json(result);
  } catch (e) {
    next(e);
  }
};

export const challengeMission = async (req, res, next) => {
  try {
    const result = await service.challengeMission(
      toChallengeMissionDto(req.params, req.body)
    );
    res.status(StatusCodes.CREATED).json(result);
  } catch (e) {
    next(e);
  }
};
