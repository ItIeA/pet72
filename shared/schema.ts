import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const petListings = pgTable("pet_listings", {
  id: serial("id").primaryKey(),
  petType: text("pet_type").notNull(),
  breed: text("breed").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  contactInfo: text("contact_info").notNull(),
});

export const insertPetListingSchema = createInsertSchema(petListings).omit({
  id: true,
}).extend({
  imageBase64: z.string().optional(),
});

export type InsertPetListing = z.infer<typeof insertPetListingSchema>;
export type PetListing = typeof petListings.$inferSelect;

export const petTypes = ["Собака", "Кошка", "Птица", "Рыбка", "Другое"] as const;