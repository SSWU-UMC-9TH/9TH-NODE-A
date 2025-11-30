export class AppError extends Error {
  constructor({
    reason,
    errorCode = "unknown",
    statusCode = 400,
    data = null,
  }) {
    super(reason);
    this.reason = reason;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.data = data;
  }
}

// 도메인별 에러
export class RegionNotFoundError extends AppError {
  constructor(regionId) {
    super({
      reason: "해당 지역이 존재하지 않습니다.",
      errorCode: "R404",
      statusCode: 404,
      data: { regionId },
    });
  }
}

export class StoreNotFoundError extends AppError {
  constructor(storeId) {
    super({
      reason: "가게가 존재하지 않습니다.",
      errorCode: "S404",
      statusCode: 404,
      data: { storeId },
    });
  }
}

export class UserNotFoundError extends AppError {
  constructor(userId) {
    super({
      reason: "사용자가 존재하지 않습니다.",
      errorCode: "U404",
      statusCode: 404,
      data: { userId },
    });
  }
}

export class MissionNotFoundError extends AppError {
  constructor(missionId) {
    super({
      reason: "미션이 존재하지 않습니다.",
      errorCode: "M404",
      statusCode: 404,
      data: { missionId },
    });
  }
}

export class AlreadyLinkedMissionError extends AppError {
  constructor({ storeId, missionId }) {
    super({
      reason: "이미 연결된 미션입니다.",
      errorCode: "M409",
      statusCode: 409,
      data: { storeId, missionId },
    });
  }
}

export class AlreadyChallengingError extends AppError {
  constructor({ userId, missionId }) {
    super({
      reason: "이미 도전 중입니다.",
      errorCode: "C409",
      statusCode: 409,
      data: { userId, missionId },
    });
  }
}

export class ValidationError extends AppError {
  constructor(reason, data) {
    super({
      reason,
      errorCode: "V400",
      statusCode: 400,
      data,
    });
  }
}

export class UserMissionNotFoundError extends AppError {
  constructor({ userId, missionId }) {
    super({
      reason: "진행 중인 미션이 없습니다.",
      errorCode: "UM404",
      statusCode: 404,
      data: { userId, missionId },
    });
  }
}

export class AlreadyCompletedError extends AppError {
  constructor({ userId, missionId }) {
    super({
      reason: "이미 완료된 미션입니다.",
      errorCode: "UM409",
      statusCode: 409,
      data: { userId, missionId },
    });
  }
}
