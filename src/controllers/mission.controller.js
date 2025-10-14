import { StatusCodes } from "http-status-codes";
import { addMissionToStore, challengeMission } from "../services/mission.service.js";

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
