export const bodyToUser = (body) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email, //필수 
    password: body.password,  //필수
    name: body.name, // 필수
    gender: body.gender, // 필수
    birth, // 필수
    address: body.address || "", //선택 
    detailAddress: body.detailAddress || "", //선택 
    phoneNumber: body.phoneNumber,//필수
    preferences: body.preferences,// 필수 
  };
};

// 내 정보 수정용 DTO (부분 업데이트 허용)
export const bodyToUserProfileUpdate = (body) => {
  const patch = {};

  if (body.name !== undefined) patch.name = body.name;
  if (body.gender !== undefined) patch.gender = body.gender;
  if (body.birth !== undefined)  patch.birth = new Date(body.birth);
  if (body.address !== undefined) patch.address = body.address || "";
  if (body.detailAddress !== undefined) patch.detailAddress = body.detailAddress || "";
  if (body.phoneNumber !== undefined) patch.phoneNumber = body.phoneNumber;

  // 선호 카테고리 ID 배열
  if (Array.isArray(body.preferences)) {
    patch.preferences = body.preferences;
  }

  return patch;
};

export const responseFromUser = ({ user, preferences }) => {
  const preferFoods = preferences.map(
    (preference) => preference.foodCategory.name
  );

  return {
    email: user.email,
    name: user.name,
    preferCategory: preferFoods,
  };
};