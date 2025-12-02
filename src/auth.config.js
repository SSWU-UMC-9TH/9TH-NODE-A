// src/auth.config.js
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./db.config.js";
import jwt from "jsonwebtoken";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

dotenv.config();

// === JWT 공통 설정 ===
const secret = process.env.JWT_SECRET;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
};

export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await prisma.user.findFirst({ where: { id: payload.id } });

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
});

export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        secret,
        { expiresIn: "1h" }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        secret,
        { expiresIn: "14d" }
    );
};

// === Google 유저 검증/생성 ===
const googleVerify = async (profile) => {
    const email = profile.emails?.[0]?.value;
    if (!email) {
        throw new Error(`profile.email was not found: ${profile}`);
    }

    const user = await prisma.user.findFirst({ where: { email } });
    if (user !== null) {
        return { id: user.id, email: user.email, name: user.name };
    }

    const created = await prisma.user.create({
        data: {
            email,
            name: profile.displayName,
            gender: "추후 수정",
            birth: new Date(1970, 0, 1),
            address: "추후 수정",
            detailAddress: "추후 수정",
            phoneNumber: "추후 수정",
        },
    });

    return { id: created.id, email: created.email, name: created.name };
};

// === Google Strategy 설정 ===
export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ["email", "profile"],
    },
    async (accessToken, refreshToken, profile, cb) => {
        try {
            // console.log("GOOGLE PROFILE", profile);  // 필요하면 한 번 찍어보기

            const user = await googleVerify(profile);

            const jwtAccessToken = generateAccessToken(user);
            const jwtRefreshToken = generateRefreshToken(user);

            return cb(null, {
                accessToken: jwtAccessToken,
                refreshToken: jwtRefreshToken,
                user, // 필요하면 유저 정보도 같이
            });
        } catch (err) {
            console.error("GoogleStrategy Error:", err);
            return cb(err);
        }
    }
);
