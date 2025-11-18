export class CustomError extends Error {
    constructor(status, code, message, data = null) {
        super(message);
        this.status = status; // HTTP 상태 코드 (예: 400, 404)
        this.code = code;     // 내부 정의 오류 코드 (예: "C400")
        this.data = data;
        this.name = this.constructor.name; 
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}


export class NotFoundError extends CustomError {
    constructor(message = "요청한 리소스를 찾을 수 없습니다.", data = null) {
        super(404, "C404", message, data);
    }
}


export class BadRequestError extends CustomError {
    constructor(message = "잘못된 요청 매개변수입니다.", data = null) {
        super(400, "C400", message, data);
    }
}

export class ConflictError extends CustomError {
    constructor(message = "요청이 리소스의 현재 상태와 충돌합니다.", data = null) {
        super(409, "C409", message, data); // 409는 HTTP CONFLICT 상태 코드
    }
}