'use client';

import { useEffect, useState } from "react";
import { getGameDetails } from "../../../lib/requests";
import { GameDetails } from "../../../types/games.types";
import GameMainInfo from "../../../components/game-main-info";
import GameMainImages from "../../../components/game-main-images";
import Rating from "../../../components/rating";
import { useParams, useRouter } from "next/navigation";
import AddToCartButton from "../../../components/add-to-cart-button";
import FavoriteButton from "../../../components/favorite-button";
import GameRatings from '../../../components/game-rating';

// Componente para mostrar el estado de carga
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      <p className="mt-4 text-gray-600">Cargando detalles del juego...</p>
    </div>
  );
}

// Componente cliente para la página de detalles de juego
export default function GameDetailPage() {
  // Obtenemos el slug de los parámetros de la URL usando useParams
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  
  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargamos los detalles del juego
  useEffect(() => {
    async function loadGameDetails() {
      if (!slug) return;
      
      try {
        setLoading(true);
        const gameData = await getGameDetails(slug);
        
        if (!gameData) {
          setError('Juego no encontrado');
          return;
        }
        
        setGame(gameData);
      } catch (err) {
        console.error("Error cargando detalles del juego:", err);
        setError('Error al cargar los detalles del juego. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }
    
    loadGameDetails();
  }, [slug]);
  
  // Mostrar spinner mientras se cargan los datos
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Mostrar mensaje de error si hay problema o no se encuentra el juego
  if (error || !game) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">
          {error || 'No se pudo cargar el juego'}
        </h1>
        <button 
          onClick={() => router.back()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Volver atrás
        </button>
      </div>
    );
  }
  
  // Calculamos el precio basado en el rating
  const price = Math.max(19.99, (game.rating || 0) * 10).toFixed(2);
  
  // Renderizamos la página de detalle del juego
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
            <div className="flex flex-wrap gap-2">
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

        {/* Valoraciones */}
        <div className="mt-6">
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