import prisma from "../db.config.js";

// 리뷰 생성
export async function insertReview(storeId, userId, missionId, rating, content) {
    // missionId는 반드시 있어야 함 (스키마상 mission이 required라서)
    const missionIdNumber = Number(missionId);

    if (!missionId || Number.isNaN(missionIdNumber)) {
        // 스키마 요구에 맞게 미션이 없으면 의미 있는 에러 던지기
        const e = new Error("B400: mission is required");
        throw e;
    }

    const data = {
        rating,
        content,
        // store 관계 연결
        store: {
            connect: { id: storeId },
        },
        // user 관계 연결
        user: {
            connect: { id: userId },
        },
        // mission 관계 연결
        mission: {
            connect: { id: missionIdNumber },
        },
    };

    const created = await prisma.review.create({
        data,
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
