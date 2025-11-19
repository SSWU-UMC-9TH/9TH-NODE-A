export const toCreateStoreDto = (params, body) => ({
  regionId: Number(params.regionId),
  name: body.name,
  address: body.address ?? "",
});

export const toCreateReviewDto = (params, body) => ({
  storeId: Number(params.storeId),
  userId: Number(body.userId),
  content: body.content ?? "",
  rating: Number(body.rating),
});

export const toLinkMissionDto = (params, body) => ({
  storeId: Number(params.storeId),
  missionId: Number(body.missionId),
});

export const toChallengeMissionDto = (params, body) => ({
  missionId: Number(params.missionId),
  userId: Number(body.userId),
});
