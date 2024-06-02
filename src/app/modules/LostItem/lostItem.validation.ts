import { object, string, boolean, array, optional } from "zod";

export const contactInfoSchema = object({
  phone: optional(string()),
  email: optional(string().email()),
});

export const lostItemSchema = object({
  categoryId: string(),
  lostItemName: string(),
  description: string(),
  location: optional(string()),
  isFound: optional(boolean()).default(false),
  contactInfo: contactInfoSchema,
  images: optional(array(string().url())),
});

export const updateLostItemSchema = object({
  categoryId: optional(string()),
  lostItemName: optional(string()),
  description: optional(string()),
  location: optional(string()),
  isFound: optional(boolean()),
  contactInfo: optional(contactInfoSchema),
  images: optional(array(string().url())),
});
