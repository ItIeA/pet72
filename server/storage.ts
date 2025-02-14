import { type PetListing, type InsertPetListing } from "@shared/schema";

export interface IStorage {
  getPetListings(): Promise<PetListing[]>;
  createPetListing(listing: InsertPetListing): Promise<PetListing>;
}

export class MemStorage implements IStorage {
  private listings: Map<number, PetListing>;
  private currentId: number;

  constructor() {
    this.listings = new Map();
    this.currentId = 1;
  }

  async getPetListings(): Promise<PetListing[]> {
    return Array.from(this.listings.values());
  }

  async createPetListing(insertListing: InsertPetListing): Promise<PetListing> {
    const id = this.currentId++;
    const listing: PetListing = {
      id,
      petType: insertListing.petType,
      breed: insertListing.breed,
      location: insertListing.location,
      description: insertListing.description,
      contactInfo: insertListing.contactInfo,
      imageUrl: insertListing.imageBase64 || null,
    };

    console.log("Creating listing with image URL length:", listing.imageUrl?.length || 0);
    this.listings.set(id, listing);
    return listing;
  }
}

export const storage = new MemStorage();