import { isRegionExist, insertStore, isStoreExist, getMissionsByStoreId as getMissionsFromRepository, insertRegion } from "../repositories/store.repository.js";

export async function addStoreToRegion(regionId, storeData) {
    const exists = await isRegionExist(regionId);
    if (!exists) {
        const e = new Error("M404: region not found");
        throw e;
    }
    return insertStore(regionId, storeData); // Prisma/RAW 버전 중 네가 선택한 구현
}

// 지역이름으로 새로운 지역 생성
export async function addRegion(name) { 
    return insertRegion(name);
}

// 가게 존재 여부 확인 서비스
export async function checkStoreExist(storeId) {
    return isStoreExist(storeId);
}

// 특정 가게 미션 목록 조회
export const getMissionsByStoreId = async (storeId, { page, size }) => {
    return getMissionsFromRepository(storeId, { page, size });
};