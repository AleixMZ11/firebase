import { getSearchedGames } from '../lib/requests';
import GameCard from './card';
import { Game } from '../types/games.types';
import { Suspense } from 'react';

export default async function GamesPage({ 
  searchParams 
}: { 
  searchParams: { search?: string } 
}) {
  const query = searchParams.search || "";
  const games = await getSearchedGames(query);
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        {query ? `Resultados para "${query}"` : "Catálogo de juegos"}
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game: Game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
      
      {games.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No se encontraron juegos.</p>
        </div>
      )}
    </div>
  );
}