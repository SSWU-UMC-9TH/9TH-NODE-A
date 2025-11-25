import { StatusCodes } from "http-status-codes";
import { signUpUser, getReviewsByUserId, isUserExist } from "../services/user.service.js";
import { ApiResponse } from "../responses/ApiResponse.js";
import { NotFoundError, BadRequestError, ConflictError } from "../errors/CustomError.js";

// 회원가입
export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = '회원가입 API'
    #swagger.description = '새로운 사용자를 회원가입 처리합니다.'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                example: "홍길동",
                description: "사용자 이름"
              },
              email: {
                type: "string",
                example: "hong@example.com",
                description: "사용자 이메일"
              },
              password: {
                type: "string",
                example: "password1234",
                description: "로그인 비밀번호"
              }
            },
            required: ["name", "email", "password"]
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "회원가입 성공",
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
                  data: {
                    type: "object",
                    properties: {
                      id:    { type: "integer", example: 1 },
                      name:  { type: "string", example: "홍길동" },
                      email: { type: "string", example: "hong@example.com" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "요청 바디가 유효하지 않은 경우 (필수 필드 누락 등)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                example: {
                  code: "B400",
                  message: "요청 데이터가 올바르지 않습니다."
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }

    #swagger.responses[409] = {
      description: "이미 존재하는 이메일로 회원가입 시도한 경우",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                example: {
                  code: "M409",
                  message: "이미 존재하는 이메일입니다."
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */

  const newUser = await signUpUser(req.body);

  const response = ApiResponse(
    StatusCodes.CREATED,
    "S201",
    "회원가입이 완료되었습니다.",
    {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }
  );
  return res.status(response.status).json(response.body);
};

// 사용자 작성 리뷰 목록 조회
export const handleGetUserReviews = async (req, res, next) => {
  /*
   #swagger.tags = ['User']
   #swagger.summary = '사용자 작성 리뷰 목록 조회 API'
   #swagger.description = '특정 사용자(userId)가 작성한 리뷰 목록을 페이지네이션하여 조회합니다.'

   #swagger.parameters['userId'] = {
     in: 'path',
     required: true,
     description: '리뷰를 조회할 사용자 ID',
     schema: { type: 'integer', example: 1 }
   }

   #swagger.parameters['page'] = {
     in: 'query',
     required: false,
     description: '페이지 번호 (1 이상, 기본값: 1)',
     schema: { type: 'integer', example: 1 }
   }

   #swagger.parameters['size'] = {
     in: 'query',
     required: false,
     description: '페이지 크기 (1 이상, 기본값: 10)',
     schema: { type: 'integer', example: 10 }
   }

   #swagger.responses[200] = {
     description: "사용자 리뷰 목록 조회 성공",
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
                 data: {
                   type: "object",
                   description: "서비스에서 정의한 리뷰 목록 + 페이지네이션 정보 구조",
                   additionalProperties: true
                 }
               }
             }
           }
         }
       }
     }
   }

   #swagger.responses[400] = {
     description: "page, size가 1 미만인 등 잘못된 요청",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
             resultType: { type: "string", example: "FAIL" },
             error: {
               type: "object",
               example: {
                 code: "B400",
                 message: "페이지 번호와 크기는 1 이상이어야 합니다."
               }
             },
             success: { type: "object", nullable: true, example: null }
           }
         }
       }
     }
   }

   #swagger.responses[404] = {
     description: "해당 사용자를 찾을 수 없는 경우",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
             resultType: { type: "string", example: "FAIL" },
             error: {
               type: "object",
               example: {
                 code: "M404",
                 message: "사용자를 찾을 수 없습니다."
               }
             },
             success: { type: "object", nullable: true, example: null }
           }
         }
       }
     }
   }
 */

  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;

  // 입력값 유효성 검사 (page, size는 양수)
  if (page < 1 || size < 1) {
    throw new BadRequestError("페이지 번호와 크기는 1 이상이어야 합니다.");
  }

  if (!(await isUserExist(userId))) {
    throw new NotFoundError("사용자를 찾을 수 없습니다.", { internal_code: "M404" });
  }


  const reviews = await getReviewsByUserId(userId, { page, size });

  const response = ApiResponse(
    StatusCodes.OK,
    "S200",
    "사용자 리뷰 목록 조회 성공",
    reviews
  );
  return res.status(response.status).json(response.body);
};