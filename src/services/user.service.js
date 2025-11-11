import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError, ValidationError } from "../errors.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
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