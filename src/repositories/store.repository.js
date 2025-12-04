import prisma from "../db.config.js";


// 특정 지역 ID가 존재하는지 확인
export const isRegionExist = async (regionId) => {
    const id = Number(regionId);
    const n = await prisma.region.count({ where: { id } });
    return n > 0;
};

/* 특정 가게 ID가 존재하는지 확인 */
export const isStoreExist = async (storeId) => {
    const id = Number(storeId);
    const n = await prisma.store.count({ where: { id } });
    return n > 0;
};

// 지역 정보 삽입
export const insertRegion = async (name) => {
    const created = await prisma.region.create({
        data: { name },
        select: { id: true },
    });
    return created.id;
};

/* 가게 정보 삽입 */
export const insertStore = async (regionId, storeData) => {
    const created = await prisma.store.create({
        data: {
            regionId: Number(regionId),
            name: storeData.name,
            address: storeData.address ?? null,
            categoryId: storeData.category_id ?? null,
            latitude: storeData.latitude ?? null,
            longitude: storeData.longitude ?? null,
        },
        select: { id: true },
    });
    return created.id;
};

/**
 * 리뷰 삽입 (review 테이블 구조 반영: mission_id NOT NULL 가정)
 */
export const insertReview = async (storeId, userId, missionId, rating, content) => {
  const storeIdNumber   = Number(storeId);
  const userIdNumber    = Number(userId);
  const missionIdNumber = Number(missionId);

  if (Number.isNaN(storeIdNumber) || Number.isNaN(userIdNumber) || Number.isNaN(missionIdNumber)) {
    const e = new Error("B400: invalid ids for review");
    throw e;
  }

  const created = await prisma.review.create({
    data: {
      rating: Number(rating),
      content: String(content),

      // 가게 관계
      store: {
        connect: { id: storeIdNumber },
      },

      // 유저 관계
      user: {
        connect: { id: userIdNumber },
      },

      // 미션 관계 
      mission: {
        connect: { id: missionIdNumber },
      },
    },
    select: { id: true },
  });

  return created.id;
};

// 특정 가게 활성 미션 목록 조회
export const getMissionsByStoreId = async (storeId, { page, size }) => {
    const id = Number(storeId); 
    const skip = (page - 1) * size;
    const take = size; 

    // 미션 목록 조회
    const missions = await prisma.mission.findMany({
        where: {
            storeId: id,
            isActive: true, // 활성 미션만 조회
        },
        skip: skip,
        take: take, 
        orderBy: {
            id: 'asc',
        },
        // 필요한 경우 여기에 include를 추가하여 관련된 정보를 포함할 수 있습니다.
    });

    return missions;
};