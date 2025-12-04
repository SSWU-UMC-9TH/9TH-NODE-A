import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError, ValidationError } from "../errors.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  updateUser,
  replacePreferences,
} from "../repositories/user.repository.js";
import bcrypt from "bcryptjs";

export const userSignUp = async (data) => {
  // 비밀번호 유효성(예: 최소 8자 등)
  if (!data.password || data.password.length < 8) {
    throw new ValidationError("비밀번호는 8자 이상이어야 합니다.", { field: "password" });
  }
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
  const passwordHash = await bcrypt.hash(data.password, saltRounds);

  const joinUserId = await addUser({
    email: data.email,
    password: passwordHash,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};

// 로그인한 사용자의 프로필 정보 수정
export const updateMyProfile = async (userId, data) => {
  if (!userId) {
    throw new ValidationError("로그인 상태에서만 수정할 수 있습니다.", { field: "userId" });
  }

  const { preferences = undefined, ...userFields } = data;

  // 유저 기본 정보 업데이트
  await updateUser(userId, userFields);

  // 선호 카테고리 교체
  if (preferences !== undefined) {
    await replacePreferences(userId, preferences);
  }

  const user = await getUser(userId);
  const userPreferences = await getUserPreferencesByUserId(userId);

  return responseFromUser({ user, preferences: userPreferences });
};