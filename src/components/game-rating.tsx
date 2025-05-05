'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../context/auth-context';
import Rating from './rating';
import RatingInput from './rating-input';

interface GameRatingsProps {
  gameId: number | string;
  gameName: string;
}

interface RatingData {
  userId: string;
  gameId: number | string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export default function GameRatings({ gameId, gameName }: GameRatingsProps) {
  const [averageRating, setAverageRating] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Función para obtener todas las valoraciones del juego
    const fetchRatings = async () => {
      setLoading(true);
      try {
        const ratingsQuery = query(
          collection(db, 'ratings'),
          where('gameId', '==', gameId)
        );
        
        const querySnapshot = await getDocs(ratingsQuery);
        
        let totalRating = 0;
        let userRatingValue = 0;
        const ratingsCount = querySnapshot.size;
        
        querySnapshot.forEach((doc) => {
          const data = doc.data() as RatingData;
          totalRating += data.rating;
          
          // Si encontramos la valoración del usuario actual, la guardamos
          if (user && data.userId === user.uid) {
            userRatingValue = data.rating;
          }
        });
        
        // Calcular promedio
        const average = ratingsCount > 0 ? totalRating / ratingsCount : 0;
        
        setAverageRating(average);
        setRatingsCount(ratingsCount);
        setUserRating(userRatingValue);
      } catch (error) {
        console.error('Error al cargar valoraciones:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRatings();
    
    // Suscribirse a cambios en tiempo real
    const ratingsQuery = query(
      collection(db, 'ratings'),
      where('gameId', '==', gameId)
    );
    
    const unsubscribe = onSnapshot(ratingsQuery, (snapshot) => {
      let totalRating = 0;
      let userRatingValue = 0;
      const count = snapshot.size;
      
      snapshot.forEach((doc) => {
        const data = doc.data() as RatingData;
        totalRating += data.rating;
        
        if (user && data.userId === user.uid) {
          userRatingValue = data.rating;
        }
      });
      
      const average = count > 0 ? totalRating / count : 0;
      setAverageRating(average);
      setRatingsCount(count);
      setUserRating(userRatingValue);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [gameId, user]);

  const handleRatingSubmit = (newRating: number) => {
    setUserRating(newRating);
    // El cambio en el promedio se manejará automáticamente por la suscripción
  };

  return (
    <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Valoraciones</h3>
      
      {loading ? (
        <div className="animate-pulse">Cargando valoraciones...</div>
      ) : (
        <>
          <div className="flex items-center mb-4">
            <Rating rating={averageRating} count={ratingsCount} />
          </div>
          
          <RatingInput 
            gameId={gameId}
            gameName={gameName}
            initialUserRating={userRating} 
            onRatingSubmit={handleRatingSubmit}
          />
        </>
      )}
    </div>
  );
}