export const bodyToCreateMission = (body) => ({
  title: body.title,
  description: body.description || "",
  rewardPoints: Number(body.rewardPoints ?? 0),
  startDate: body.startDate || null,
  endDate: body.endDate || null,
  isActive: typeof body.isActive === "boolean" ? body.isActive : true,
});

export const responseFromMission = (row) => ({
  id: row.id,
  storeId: row.store_id,
  title: row.title,
  description: row.description,
  rewardPoints: row.reward_points,
  startDate: row.start_date,
  endDate: row.end_date,
  isActive: !!row.is_active,
  createdAt: row.created_at,
});

export const responseFromUserMission = (row) => ({
  id: row.id,
  userId: row.user_id,
  missionId: row.mission_id,
  status: row.status,
  startedAt: row.started_at,
  completedAt: row.completed_at,
});
