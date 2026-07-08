import { Role } from "../../../generated/prisma/enums";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role
  phone?: string;
  image?: string;
}

export interface LoginUserPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  image?: string;
}