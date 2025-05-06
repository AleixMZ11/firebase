import { getGameDetails } from "../../../lib/requests";
import { GameDetails } from "../../../types/games.types";
import GameMainInfo from "../../../components/game-main-info";
import GameMainImages from "../../../components/game-main-images";
import Rating from "../../../components/rating";
import { notFound } from "next/navigation";
import AddToCartButton from "../../../components/add-to-cart-button";
import FavoriteButton from "../../../components/favorite-button";
import GameRatings from '../../../components/game-rating';

// Elimina el "async" si getGameDetails no es asíncrono, o manténlo si lo es
export default async function GameDetailPage({ params }: { params: { slug: string } }) {
  // Elimina esta línea - es lo que causa el error
  // const resolvedParams = await params;

  // Usa directamente params.slug en lugar de resolvedParams.slug
  const game = await getGameDetails(params.slug);

  if (!game) {
    notFound();
  }
  
  // Precio ficticio basado en el rating
  const price = Math.max(19.99, (game.rating || 0) * 10).toFixed(2);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Cabecera del juego */}
      <div 
        className="relative h-64 md:h-96 bg-cover bg-center" 
        style={{ backgroundImage: `url(${game.background_image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">{game.name}</h1>
          <div className="flex items-center space-x-4">
            <Rating rating={game.rating || 0} />
            <div className="flex space-x-2">
              {game.genres?.map((genre) => (
                <span key={genre.name} className="bg-blue-600/80 text-white text-xs px-2 py-1 rounded">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      
      
      <div className="p-6 md:p-10">
        {/* Acciones e información principal */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-10">
          <div className="mb-6 md:mb-0 md:mr-10">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">€{price}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Lanzado: {game.released || "Fecha no disponible"}
            </p>
          </div>
          
          <div className="flex space-x-4 items-center">
            <AddToCartButton game={game} />
            <FavoriteButton game={game} />
          </div>
        </div>
        
        {/* Imágenes del juego */}
        <GameMainImages game={game} />
        
        {/* Información detallada */}
        <GameMainInfo game={game} />
       {/* Añadir esto aquí para las valoraciones */}
       <div className="px-6 md:px-10 mt-6">
        <GameRatings gameId={game.id} gameName={game.name} />
      </div>
        {/* Descripción */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Descripción</h2>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: game.description }} />
          </div>
        </div>
      </div>
    </div>
  );
}