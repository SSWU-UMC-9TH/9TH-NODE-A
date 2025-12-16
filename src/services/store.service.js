import * as StoreRepo from '../repositories/store.repository.js';

/**
 * 특정 지역에 가게를 추가하는 서비스 로직
 */
export const addStoreToRegion = async (regionId, storeData) => {
    // 1. 지역 존재 검증
    const exists = await StoreRepo.isRegionExist(regionId);
    if (!exists) {
        throw new Error("M404: 해당 지역을 찾을 수 없습니다.");
    }

    // 2. 가게 삽입
    const storeId = await StoreRepo.insertStore(regionId, storeData);

    return storeId;
};