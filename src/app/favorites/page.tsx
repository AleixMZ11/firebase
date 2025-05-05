'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../context/auth-context';
import GameCard from '../../components/card';
import { Game } from '../../types/games.types';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    
    // Redirigir si no hay usuario
    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchFavorites() {
      setLoading(true);
      setError(null);
      
      // Verificación adicional por seguridad
      if (!user) {
        setLoading(false);
        setError('Necesitas iniciar sesión para ver tus favoritos');
        return;
      }
      
      try {
        // Consulta filtrada por userId para cumplir con las reglas de seguridad
        const q = query(
          collection(db, 'favorites'),
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
const favoritesData = querySnapshot.docs.map(doc => {
  const data = doc.data();
  // Normaliza los datos para que sean compatibles con la interfaz Game
  return {
    id: data.gameId || data.id, // Asegura que id siempre exista
    gameId: data.gameId || data.id, // Mantiene gameId para compatibilidad
    name: data.name || 'Sin nombre',
    slug: data.slug || '',
    background_image: data.background_image || '/placeholder-game.jpg',
    rating: data.rating || 0,
    userId: data.userId
  } as Game;
});
setFavorites(favoritesData);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError('No se pudieron cargar los favoritos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse">Cargando favoritos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Mis Juegos Favoritos</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8">
          <p>{error}</p>
        </div>
      )}
      
      {!error && favorites.length === 0 ? (
        <div className="text-center text-gray-500 my-12 p-8 border border-dashed rounded-lg">
          <p className="mb-4">No tienes juegos favoritos. Explora el catálogo y marca algunos como favoritos.</p>
          <button 
            onClick={() => router.push('/')} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Explorar juegos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((game, index) => (
          <GameCard 
            key={game.id || `favorite-${index}`} 
            game={game} 
          />
        ))}
      </div>
      )}
    </div>
  );
}