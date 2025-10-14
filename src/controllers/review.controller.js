import { StatusCodes } from "http-status-codes";
import { addReviewToStore } from "../services/review.service.js";

export const handleAddReviewToStore = async (req, res) => {
  try {
    const storeId = Number(req.params.storeId);
    const result = await addReviewToStore({ storeId, body: req.body });
    res.status(StatusCodes.CREATED).json({ result });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: e.message });
  }
};
