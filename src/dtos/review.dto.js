export const bodyToCreateReview = (body) => ({
  rating: Number(body.rating),
  content: body.content?.trim() || "",
});

export const responseFromReview = (row) => ({
  id: row.id,
  storeId: row.store_id,
  userId: row.user_id,
  rating: row.rating,
  content: row.content,
  createdAt: row.created_at,
});
