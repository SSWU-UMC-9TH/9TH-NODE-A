import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./db.config.js";
import jwt from "jsonwebtoken"; // JWT 생성을 위해 import 
import bcrypt from "bcryptjs";

dotenv.config();
const secret = process.env.JWT_SECRET; // .env의 비밀 키 

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, 
    secret,                           
    { expiresIn: '1h' }                 
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },                   
    secret,
    { expiresIn: '14d' }                
  );
};

// GoogleVerify
const googleVerify = async (profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) {
    throw new Error(`profile.email was not found: ${JSON.stringify(profile)}`);
  }


  const user = await prisma.user.findFirst({ where: { email } });
  if (user !== null) {
    return { id: user.id, email: user.email, name: user.name };
  }

  
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
  const randomPasswordSeed =
    Math.random().toString(36).slice(2) + Date.now().toString();
  const passwordHash = await bcrypt.hash(randomPasswordSeed, saltRounds);

  const created = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      name: profile.displayName || "Google 사용자",
      gender: "추후 수정",
      birth: new Date(1970, 0, 1),
      address: "추후 수정",
      detailAddress: "추후 수정",
      phoneNumber: "추후 수정",
    },
  });

  const { password, ...safeUser } = created;

  return { id: safeUser.id, email: safeUser.email, name: safeUser.name };
};

const callbackURL =
  process.env.GOOGLE_CALLBACK_URL ||
  "http://localhost:3000/oauth2/callback/google";

// GoogleStrategy
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL, // 여기서 env 사용
    scope: ["email", "profile"],
  },

  async (accessToken, refreshToken, profile, cb) => {
    try {
      // 1) 유저 조회/생성
      const user = await googleVerify(profile);

      // 2) JWT 발급
      const jwtAccessToken = generateAccessToken(user);
      const jwtRefreshToken = generateRefreshToken(user);

      // 3) 인증 성공 콜백
      return cb(null, {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      });
    } catch (err) {
      return cb(err);
    }
  }
);

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const jwtOptions = {
  // 요청 헤더의 'Authorization'에서 'Bearer <token>' 토큰을 추출
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: payload.id } });

    if (!user) {
      return done(null, false);
    }

    const { password, ...safeUser } = user;

    // password 제외한 safeUser를 넘김
    return done(null, safeUser);

  } catch (err) {
    return done(err, false);
  }
});
