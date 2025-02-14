import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { petTypes } from "@shared/schema";

interface SearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedType: string | null;
  onTypeChange: (value: string | null) => void;
}

export function SearchFilters({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1">
        <Input
          placeholder="Поиск по местоположению, породе или описанию..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select
        value={selectedType ?? "all"}
        onValueChange={(value) => onTypeChange(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Тип питомца" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все типы</SelectItem>
          {petTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}