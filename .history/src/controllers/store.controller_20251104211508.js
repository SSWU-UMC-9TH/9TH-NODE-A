import { StatusCodes } from "http-status-codes";
import { addStoreToRegion, listStoreReviews } from "../services/store.service.js";

export const handleAddStoreToRegion = async (req, res, next) => {
  try {
    const regionId = Number(req.params.regionId);
    const result = await addStoreToRegion({ regionId, body: req.body });
    res.status(StatusCodes.CREATED).json({ result });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: e.message });
  }
};

export const handleListStoreReviews = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;
    const reviews = await listStoreReviews(storeId, cursor);
    res.status(StatusCodes.OK).json(reviews);
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: e.message });
  }
};