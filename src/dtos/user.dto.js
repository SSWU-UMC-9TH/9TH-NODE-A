export const bodyToUser = (body) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email, //필수 
    name: body.name, // 필수
    gender: body.gender, // 필수
    birth, // 필수
    address: body.address || "", //선택 
    detailAddress: body.detailAddress || "", //선택 
    phoneNumber: body.phoneNumber,//필수
    preferences: body.preferences,// 필수 
  };
};

export const responseFromUser = ({ user, preferences }) => {
 
  const u = Array.isArray(user) ? user[0] : user;

  if (!u) {
    return {
      user: null,
      preferences: [],
    };
  }

  // birth를 YYYY-MM-DD 문자열로 정규화 (Date거나 문자열일 수 있음)
  const birthStr =
    u.birth instanceof Date
      ? u.birth.toISOString().slice(0, 10)
      : typeof u.birth === "string"
      ? u.birth.slice(0, 10)
      : "";

  return {
    user: {
      id: u.id,
      email: u.email,
      name: u.name,
      gender: u.gender,
      birth: birthStr,
      address: u.address ?? "",
      detailAddress: u.detail_address ?? u.detailAddress ?? "",
      phoneNumber: u.phone_number ?? u.phoneNumber ?? "",
    },
    preferences: (preferences ?? []).map((p) => ({
      id: p.id,
      foodCategoryId: p.food_category_id,
      name: p.name,
    })),
  };
};