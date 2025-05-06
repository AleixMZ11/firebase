'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Game } from '../types/games.types';
import { FirebaseError } from 'firebase/app';

export default function FavoriteButton({ game }: { game: Game }) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comprobar si ya es favorito cuando se carga el componente
  useEffect(() => {
    async function checkIfFavorite() {
      if (!user) {
        setLoading(false);
        return;
      }
  
      // Usar solo la propiedad id que está garantizada que existe
      const gameId = game.id;
      
      if (!gameId) {
        console.warn('No se puede verificar favorito: ID de juego no válido', game);
        setLoading(false);
        return;
      }
  
      try {
        const docRef = doc(db, 'favorites', `${user.uid}_${gameId}`);
        const docSnap = await getDoc(docRef);
        setIsFavorite(docSnap.exists());
        setError(null);
      } catch (error) {
        console.error('Error al verificar favorito:', error);
        setError('Error al comprobar favoritos');
      } finally {
        setLoading(false);
      }
    }
  
    checkIfFavorite();
  }, [user, game]);

  // Manejar clic en el botón de favorito
  async function toggleFavorite() {
    if (!user) {
      alert('Debes iniciar sesión para guardar favoritos');
      return;
    }
  
    // Usar solo la propiedad id
    const gameId = game.id;
    
    // Verificar que el juego tenga un ID válido
    if (!gameId) {
      console.error('Error: ID de juego no válido', game);
      setError('El juego no tiene un ID válido');
      return;
    }
  
    setLoading(true);
    try {
      const favoriteId = `${user.uid}_${gameId}`;
      const favoriteRef = doc(db, 'favorites', favoriteId);
  
      if (isFavorite) {
        await deleteDoc(favoriteRef);
        setIsFavorite(false);
      } else {
        await setDoc(favoriteRef, {
          userId: user.uid,
          gameId: gameId, // Usar id como gameId
          name: game.name,
          slug: game.slug,
          background_image: game.background_image || null,
          rating: game.rating || 0,
          addedAt: new Date().toISOString(),
          id: gameId // Mantener coherencia con id
        });
        setIsFavorite(true);
      }
      setError(null);
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
      setError('Error al actualizar favoritos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className={`p-2 rounded-full focus:outline-none transition transform hover:scale-110 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        } ${
          isFavorite 
            ? 'text-red-500 hover:text-red-700' 
            : 'text-gray-400 hover:text-red-500'
        }`}
        aria-label={isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
      >
        {loading ? '⌛' : (isFavorite ? '❤️' : '🤍')}
      </button>
      {error && (
        <div className="absolute top-full right-0 mt-1 text-xs bg-gray-800 text-white p-1 rounded whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}