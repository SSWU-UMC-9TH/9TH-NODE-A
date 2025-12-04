export class AppError extends Error {
  constructor({ reason, errorCode = "unknown", statusCode = 400, data = null }) {
    super(reason);
    this.reason = reason;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.data = data;
  }
}

export class ValidationError extends AppError {
  constructor(reason, data) {
    super({ reason, data, errorCode: "VAL001", statusCode: 400 });
  }
}

export class NotFoundError extends AppError {
  constructor(reason, data) {
    super({ reason, data, errorCode: "NOT_FOUND", statusCode: 404 });
  }
}

export class ConflictError extends AppError {
  constructor(reason, data) {
    super({ reason, data, errorCode: "CONFLICT", statusCode: 409 });
  }
}

export class UnauthorizedError extends AppError {
  constructor(reason, data) {
    super({ reason, data, errorCode: "UNAUTHORIZED", statusCode: 401 });
  }
}

// 기존 중복 이메일 에러를 상속 구조로 정리
export class DuplicateUserEmailError extends ConflictError {
  constructor(reason, data) {
    super(reason, data);
    this.errorCode = "U001";
  }
}

// 유저 관련 자주 쓰는 에러
export class MissingUserError extends NotFoundError {
  constructor(reason = "사용자가 없습니다. 먼저 사용자를 생성하세요.", data) {
    super(reason, data);
    this.errorCode = "U404";
  }
}

// 미션 중복 도전
export class AlreadyChallengingError extends ConflictError {
  constructor(reason = "이미 도전 중인 미션입니다.", data) {
    super(reason, data);
    this.errorCode = "M001";
  }
}