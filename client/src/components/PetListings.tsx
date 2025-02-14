import { useQuery } from "@tanstack/react-query";
import { type PetListing } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface PetListingsProps {
  search: string;
  selectedType: string | null;
}

export function PetListings({ search, selectedType }: PetListingsProps) {
  const { data: listings = [], isLoading } = useQuery<PetListing[]>({
    queryKey: ["/api/listings"],
  });

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = 
      listing.location.toLowerCase().includes(search.toLowerCase()) ||
      listing.breed.toLowerCase().includes(search.toLowerCase()) ||
      listing.description.toLowerCase().includes(search.toLowerCase());

    const matchesType = !selectedType || listing.petType === selectedType;

    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Загрузка объявлений...</p>
      </div>
    );
  }

  if (filteredListings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Объявления не найдены</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredListings.map((listing) => (
        <Card key={listing.id} className="overflow-hidden">
          {listing.imageUrl && (
            <div className="aspect-video relative">
              <img
                src={listing.imageUrl}
                alt={`${listing.breed}`}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  // Hide broken images
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{listing.breed}</CardTitle>
              <Badge>{listing.petType}</Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              {listing.location}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{listing.description}</p>
            <p className="text-sm font-medium">Контакт: {listing.contactInfo}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}