import prisma from "../db.config.js";

/**
 * 리뷰 생성
 * 현재 스키마(Review)에는 missionId가 없으므로 storeId/userId/rating/content만 저장.
 * missionId가 필요한 설계라면 스키마에 missionId 필드를 추가한 뒤 수정하세요.
 */
export async function insertReview(storeId, userId, missionId, rating, content) {
    const created = await prisma.review.create({
        data: {
            storeId: Number(storeId),
            userId: Number(userId),
            missionId: Number(missionId),
            rating: Number(rating),
            content: String(content ?? ""),
        },
        select: { id: true },
    });
    return created.id;
}

/**
 * 내가 작성한 리뷰 목록 (페이지네이션)
 */
export async function getReviewsByUser(userId, { page = 1, size = 10 } = {}) {
    const skip = (page - 1) * size;

    const [items, total] = await Promise.all([
        prisma.review.findMany({
            where: { userId: Number(userId) },
            orderBy: { createdAt: "desc" },
            include: { store: { select: { id: true, name: true } } },
            take: size,
            skip,
        }),
        prisma.review.count({ where: { userId: Number(userId) } }),
    ]);

    return { items, page, size, total, totalPages: Math.ceil(total / size) };
}
