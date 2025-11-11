import { StatusCodes } from "http-status-codes";
import { addStoreToRegion, listStoreReviews } from "../services/store.service.js";

export const handleAddStoreToRegion = async (req, res, next) => {
  try {
    const regionId = Number(req.params.regionId);
    const result = await addStoreToRegion({ regionId, body: req.body });
    return res.status(StatusCodes.CREATED).success(result);
  } catch (e) {
    return next(e);
  }
};

export const handleListStoreReviews = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;
    const reviews = await listStoreReviews(storeId, cursor);
    return res.status(StatusCodes.OK).success(reviews);
  } catch (e) {
    return next(e);
  }
};
