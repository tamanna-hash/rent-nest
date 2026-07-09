import { UserStatus } from "../../../generated/prisma/enums";

export interface UpdateUserStatusPayload {
  status: UserStatus;
}