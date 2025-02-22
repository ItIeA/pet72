// Импорты
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Switch, Route } from 'wouter';

// Компоненты
import { Toaster } from './components/ui/toaster';
import { CreatePetListing } from './components/CreatePetListing';
import { PetListings } from './components/PetListings';
import { SearchFilters } from './components/SearchFilters';

// Утилиты и хуки
import { apiRequest } from './lib/queryClient';

// Константы и типы
const petTypes = ["Собака", "Кошка", "Птица", "Рыбка", "Другое"];

// Инициализация QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
  },
});

// Компонент App
function App() {
  const [search, setSearch] = React.useState("");
  const [selectedType, setSelectedType] = React.useState(null);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto py-8 px-4">
          <h1 className="page-title">PetHelper72</h1>
          
          <div className="grid-layout">
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
      <Toaster />
    </QueryClientProvider>
  );
}

// Рендеринг приложения
createRoot(document.getElementById('root')).render(<App />);

// API функции
async function getPetListings() {
  const response = await fetch('/api/listings');
  if (!response.ok) throw new Error('Failed to fetch listings');
  return response.json();
}

async function createPetListing(data) {
  const response = await fetch('/api/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create listing');
  return response.json();
}

// Экспорт API функций
export { getPetListings, createPetListing };
