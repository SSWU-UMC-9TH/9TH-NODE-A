import prisma from "../db.config.js"; // 단일 인스턴스 사용

export async function signUpUser(payload) {
  const {
    email,
    name,
    gender,
    birth, // birth는 "YYYY-MM-DD" 형태의 문자열이라고 가정
    address,
    detailAddress,
    phoneNumber,
  } = payload;

  // 1) 중복 체크 (스키마에 email @unique 있음)
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    // Controller에서 처리되도록 에러 던지기
    const err = new Error("M409: duplicate email");
    throw err;
  }

  // 2) 생성
  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      gender,
      birth: new Date(birth),
      address,
      detailAddress: detailAddress ?? null, // nullable
      phoneNumber,
    },
    // 필요한 필드만 선택하고 싶다면 select 사용 가능
    // select: { id: true, name: true, email: true }
  });

  return newUser;
}

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