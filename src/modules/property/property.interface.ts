import { Property } from "../../../generated/prisma/client";


export interface CreatePropertyPayload
  extends Omit<
    Property,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "landlordId"
    | "isAvailable"
  > {}

export interface UpdatePropertyPayload {
  title?: string;
  description?: string;
  location?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  categoryId?: string;
  isAvailable?: boolean;
}