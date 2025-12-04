import prisma from "../db.config.js"; // 단일 인스턴스 사용
import { ConflictError } from "../errors/CustomError.js";

export async function signUpUser(payload) {
  const {
    email,
    name,
    gender,
    birth, // "YYYY-MM-DD" 또는 undefined
    address,
    detailAddress,
    phoneNumber,
  } = payload;

  // 1) 중복 체크
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new ConflictError("이미 존재하는 이메일입니다.", {
      internal_code: "M409",
    });
  }

  // 2) birth 값 결정 (항상 어떤 값이든 하나 넣기)
  let birthDate;
  if (birth) {
    const d = new Date(birth);
    if (!isNaN(d.getTime())) {
      birthDate = d;
    } else {
      // 형식이 이상하게 들어온 경우: 안전하게 기본값
      birthDate = new Date(1970, 0, 1);
    }
  } else {
    // 아예 안 넘어오면 기본값 (구글 로그인에서 쓰던 값이랑 맞춤)
    birthDate = new Date(1970, 0, 1);
  }

  // 3) Prisma에 넘길 data
  const data = {
    email,
    name,
    gender: gender ?? "추후 수정",
    birth: birthDate,                        // 항상 값 있음
    address: address ?? "추후 수정",         // 선택: 없으면 기본값
    detailAddress: detailAddress ?? "추후 수정",
    phoneNumber: phoneNumber ?? "추후 수정",
  };

  const newUser = await prisma.user.create({ data });
  return newUser;
}


export const updateUserByEmail = async (email, payload) => {
  const {
    name,
    gender,
    birth,
    address,
    detailAddress,
    phoneNumber,
    password, // 필요하다면 여기서 해싱해서 저장
  } = payload;

  const updated = await prisma.user.update({
    where: { email },
    data: {
      // 넘어온 값들만 갱신하고 싶다면 조건부로 넣어도 됨
      ...(name !== undefined && { name }),
      ...(gender !== undefined && { gender }),
      ...(birth !== undefined && { birth: new Date(birth) }),
      ...(address !== undefined && { address }),
      ...(detailAddress !== undefined && { detailAddress }),
      ...(phoneNumber !== undefined && { phoneNumber }),
      // 비밀번호 컬럼이 있다면 여기에 password 처리
      // ...(password !== undefined && { password: hash(password) }),
    },
  });

  return updated;
};


export const isUserExist = async (userId) => {
  const id = Number(userId);
  const n = await prisma.user.count({ where: { id } });
  return n > 0;
};

export const getReviewsByUserId = async (userId, { page, size }) => {
  const id = Number(userId);

  const skip = (page - 1) * size;
  const take = size;

  // Prisma를 사용하여 해당 userId로 작성된 모든 리뷰를 찾습니다.
  const reviews = await prisma.review.findMany({
    where: {
      userId: id,
    },
    // 페이지네이션 적용
    skip: skip,
    take: take,
    // 최신 정렬
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      store: {
        select: {
          name: true,
        },
      },
    },
  });

  return reviews;
};