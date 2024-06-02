import { object, string, array, optional } from "zod";

export const contactInfoSchema = object({
  phone: optional(string()),
  email: optional(string().email()),
});

export const foundItemSchema = object({
  categoryId: string(),
  foundItemName: string(),
  description: string(),
  location: string(),
  dateFound: string(),
  contactInfo: optional(contactInfoSchema),
  images: optional(array(string().url())),
});
