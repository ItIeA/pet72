import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertPetListingSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/listings", async (_req, res) => {
    const listings = await storage.getPetListings();
    res.json(listings);
  });

  app.post("/api/listings", async (req, res) => {
    try {
      const validatedData = insertPetListingSchema.parse(req.body);
      const listing = await storage.createPetListing(validatedData);
      res.json(listing);
    } catch (error) {
      res.status(400).json({ message: "Invalid listing data" });
    }
  });

  return createServer(app);
}
