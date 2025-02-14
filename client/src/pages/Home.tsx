import { useState } from "react";
import { CreatePetListing } from "@/components/CreatePetListing";
import { PetListings } from "@/components/PetListings";
import { SearchFilters } from "@/components/SearchFilters";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Pet Listings
        </h1>
        
        <div className="grid gap-8 md:grid-cols-[1fr_400px]">
          <div className="order-2 md:order-1">
            <SearchFilters
              search={search}
              onSearchChange={setSearch}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
            />
            <PetListings search={search} selectedType={selectedType} />
          </div>
          
          <div className="order-1 md:order-2">
            <CreatePetListing />
          </div>
        </div>
      </main>
    </div>
  );
}
