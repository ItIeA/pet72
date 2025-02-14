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
    let imageUrl = null;

    // Проверяем, что строка base64 начинается с data:image
    if (insertListing.imageBase64 && insertListing.imageBase64.startsWith('data:image')) {
      imageUrl = insertListing.imageBase64;
    }

    const listing: PetListing = {
      id,
      petType: insertListing.petType,
      breed: insertListing.breed,
      location: insertListing.location,
      description: insertListing.description,
      contactInfo: insertListing.contactInfo,
      imageUrl,
    };

    console.log("Creating listing with image:", {
      id: listing.id,
      hasImage: !!listing.imageUrl,
      imageUrlLength: listing.imageUrl?.length || 0,
      imageUrlStart: listing.imageUrl?.substring(0, 50)
    });

    this.listings.set(id, listing);
    return listing;
  }
}

export const storage = new MemStorage();