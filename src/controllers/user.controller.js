import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  try {
    const user = await userSignUp(bodyToUser(req.body));
    return res.status(StatusCodes.OK).success(user);
  } catch (e) {
    return next(e);
  }
  /*
    #swagger.summary = '회원 가입 API'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password", "name", "gender", "birth", "phoneNumber", "preferences"],
            properties: {
              email: {
                type: "string",
                description: "사용자 이메일 (로그인 ID로 사용)",
                example: "test@example.com"
              },
              password: {
                type: "string",
                description: "비밀번호 (8자 이상)",
                example: "password1234"
              },
              name: {
                type: "string",
                description: "사용자 이름",
                example: "UMC"
              },
              gender: {
                type: "string",
                description: "성별",
                example: "여성"
              },
              birth: {
                type: "string",
                format: "date",
                description: "생년월일",
                example: "2000-01-01"
              },
              address: {
                type: "string",
                description: "주소(선택)",
                example: "서울시"
              },
              detailAddress: {
                type: "string",
                description: "상세 주소(선택)",
                example: "UMC구 챌린저동 화이팅아파트"
              },
              phoneNumber: {
                type: "string",
                description: "전화번호",
                example: "010-1234-5678"
              },
              preferences: {
                type: "array",
                description: "선호 음식 카테고리 ID 목록",
                items: { type: "number" },
                example: [1, 2]
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "회원 가입 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  email: { type: "string", example: "test@example.com" },
                  name: { type: "string", example: "UMC" },
                  preferCategory: {
                    type: "array",
                    description: "선호 음식 카테고리 이름 목록",
                    items: { type: "string" },
                    example: ["한식", "분식"]
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "요청 값 검증 실패 (예: 비밀번호 길이 부족 등)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: {
                    type: "string",
                    description: "검증 에러 코드",
                    example: "VAL001"
                  },
                  reason: {
                    type: "string",
                    description: "에러 원인 메시지",
                    example: "비밀번호는 8자 이상이어야 합니다."
                  },
                  data: {
                    type: "object",
                    description: "추가적인 에러 정보(어떤 필드에서 오류가 났는지 등)",
                    example: { field: "password" }
                  }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
    #swagger.responses[409] = {
      description: "이메일 중복으로 인한 회원 가입 실패",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: {
                    type: "string",
                    description: "중복 이메일 에러 코드",
                    example: "U001"
                  },
                  reason: {
                    type: "string",
                    description: "에러 원인 메시지",
                    example: "이미 존재하는 이메일입니다."
                  },
                  data: {
                    type: "object",
                    description: "중복된 이메일 정보 등",
                    example: { email: "test@example.com" }
                  }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
};