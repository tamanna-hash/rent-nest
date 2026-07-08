import bcrypt from "bcryptjs";
import { JwtPayload, SignOptions } from "jsonwebtoken";


import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";

import {
  LoginUserPayload,
  RegisterUserPayload,
  UpdateProfilePayload,
} from "./auth.interface";
import { Role } from "../../../generated/prisma/enums";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, role, phone, image } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User already exists with this email.");
  }

  if (role === Role.ADMIN) {
    throw new Error("You cannot register as an admin.");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds)
  );

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      image,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const updateMyProfileInDB = async (
  userId: string,
  payload: UpdateProfilePayload
) => {
  const { name, phone, image } = payload;

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      phone,
      image,
    },
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

const loginUser = async (payload: LoginUserPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  if (user.status === "BANNED") {
    throw new Error("Your account has been blocked.");
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password.");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshToken: string) => {
  const verifiedToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_secret
  );

  if (!verifiedToken.success) {
    throw new Error(verifiedToken.error);
  }

  const { id } = verifiedToken.data as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (user.status === "BANNED") {
    throw new Error("User is blocked.");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions
  );

  return {
    accessToken,
  };
};

export const authService = {
  registerUserIntoDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
  loginUser,
  refreshToken,
};