import * as service from "../services/store.service.js";
import {
  toCreateStoreDto,
  toCreateReviewDto,
  toLinkMissionDto,
  toChallengeMissionDto,
} from "../dtos/store.dto.js";
import { StatusCodes } from "http-status-codes";

export const createStore = async (req, res) => {
  try {
    const result = await service.createStore(
      toCreateStoreDto(req.params, req.body)
    );
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const result = await service.createReview(
      toCreateReviewDto(req.params, req.body)
    );
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

export const linkMission = async (req, res) => {
  try {
    const result = await service.linkMission(
      toLinkMissionDto(req.params, req.body)
    );
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

export const challengeMission = async (req, res) => {
  try {
    const result = await service.challengeMission(
      toChallengeMissionDto(req.params, req.body)
    );
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};
