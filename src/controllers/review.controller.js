import { StatusCodes } from "http-status-codes";
import { addReviewToStore, listMyReviews } from "../services/review.service.js";

export const handleAddReviewToStore = async (req, res) => {
  try {
    const storeId = Number(req.params.storeId);
    const result = await addReviewToStore({ storeId, body: req.body });
    res.status(StatusCodes.CREATED).json({ result });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: e.message });
  }
};

export const handleListMyReviews = async (req, res) => {
  try {
    const cursor = Number.isFinite(Number(req.query?.cursor)) ? Number(req.query.cursor) : 0;
    const take   = Number.isFinite(Number(req.query?.take))   ? Number(req.query.take)   : 5;

    const result = await listMyReviews(cursor, take, undefined);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
