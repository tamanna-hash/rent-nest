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

export interface PropertyFilters {
  search?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  amenities?: string[];
  page?: number;
  limit?: number;
}