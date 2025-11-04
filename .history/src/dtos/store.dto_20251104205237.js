export const bodyToCreateStore = (body) => ({
  name: body.name,
  address: body.address || "",
  foodCategoryId: body.foodCategoryId ?? null,
});

export const responseFromStore = (row) => ({
  id: row.id,
  name: row.name,
  address: row.address,
  regionId: row.region_id,
  foodCategoryId: row.food_category_id,
  createdByUserId: row.created_by_user_id,
  createdAt: row.created_at,
});

export const responseFromReviews = (reviews) => {
  return {
    data: reviews,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].id : null,
    },
  };
};