import { StatusCodes } from "http-status-codes";
import { addReviewToStore, listMyReviews } from "../services/review.service.js";

export const handleAddReviewToStore = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    const result = await addReviewToStore({ storeId, body: req.body });
    return res.status(StatusCodes.CREATED).success(result);
  } catch (e) {
    return next(e);
  }
};

export const handleListMyReviews = async (req, res, next) => {
  try {
    const cursor = Number.isFinite(Number(req.query?.cursor)) ? Number(req.query.cursor) : 0;
    const take   = Number.isFinite(Number(req.query?.take))   ? Number(req.query.take)   : 5;

    const result = await listMyReviews(cursor, take, undefined);
    return res.status(StatusCodes.OK).success(result);
  } catch (e) {
    return next(e);
  }
};
