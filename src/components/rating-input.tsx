'use client';

import { useState } from 'react';
import { useAuth } from '../context/auth-context';
import { doc, setDoc, collection, getDocs, query, where, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

interface RatingInputProps {
  gameId: number | string;
  gameName: string;
  initialUserRating?: number;
  onRatingSubmit?: (rating: number) => void;
}

export default function RatingInput({ gameId, gameName, initialUserRating = 0, onRatingSubmit }: RatingInputProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(initialUserRating);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ 
    text: '', 
    type: '' 
  });
  const { user } = useAuth();

  const handleStarHover = (star: number) => {
    setHoveredStar(star);
  };

  const handleStarLeave = () => {
    setHoveredStar(null);
  };

  const handleStarClick = async (rating: number) => {
    if (!user) {
      setMessage({
        text: 'Debes iniciar sesión para valorar juegos',
        type: 'error'
      });
      return;
    }

    setSelectedRating(rating);
    setIsSaving(true);
    
    try {
      const ratingId = `${user.uid}_${gameId}`;
      const ratingRef = doc(db, 'ratings', ratingId);
      
      await setDoc(ratingRef, {
        userId: user.uid,
        gameId: gameId,
        gameName: gameName,
        rating: rating,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      setMessage({
        text: '¡Gracias por tu valoración!',
        type: 'success'
      });
      
      // Notificar al componente padre sobre el cambio
      if (onRatingSubmit) {
        onRatingSubmit(rating);
      }
    } catch (error) {
      console.error('Error al guardar valoración:', error);
      setMessage({
        text: 'Error al guardar tu valoración. Inténtalo de nuevo.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const effectiveRating = hoveredStar !== null ? hoveredStar : selectedRating;

  return (
    <div className="mt-4">
      <p className="text-sm font-medium mb-1">¿Qué te ha parecido este juego?</p>
      <div className="flex items-center">
        <div className="flex text-2xl" onMouseLeave={handleStarLeave}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={isSaving}
              className={`cursor-pointer focus:outline-none ${
                isSaving ? 'opacity-50' : ''
              }`}
              onMouseEnter={() => handleStarHover(star)}
              onClick={() => handleStarClick(star)}
              aria-label={`Valorar con ${star} estrellas`}
            >
              <span className={star <= effectiveRating ? 'text-yellow-400' : 'text-gray-300'}>
                ★
              </span>
            </button>
          ))}
        </div>
        {selectedRating > 0 && (
          <span className="ml-2 text-sm text-gray-600">
            Tu valoración: {selectedRating}/5
          </span>
        )}
      </div>
      {message.text && (
        <p className={`text-sm mt-1 ${
          message.type === 'success' ? 'text-green-600' : 'text-red-600'
        }`}>
          {message.text}
        </p>
      )}
    </div>
  );
}