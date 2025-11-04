import { StatusCodes } from "http-status-codes";
import { addStoreToRegion } from "../services/store.service.js";

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
  const reviews = await listStoreReviews(
    req.params.storeId
  );
  res.status(StatusCodes.OK).json(reviews);
};