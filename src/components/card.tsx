'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Game } from '../types/games.types';
import FavoriteButton from './favorite-button';
import Rating from './rating';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function GameCard({ game }: { game: Game }) {
  const [avgRating, setAvgRating] = useState(game.rating || 0);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    // Obtener valoraciones específicas de usuarios si es posible
    const fetchUserRatings = async () => {
      try {
        const ratingsQuery = query(
          collection(db, 'ratings'),
          where('gameId', '==', game.id)
        );
        
        const querySnapshot = await getDocs(ratingsQuery);
        
        if (querySnapshot.size > 0) {
          let totalRating = 0;
          querySnapshot.forEach(doc => {
            totalRating += doc.data().rating;
          });
          
          const average = totalRating / querySnapshot.size;
          setAvgRating(average);
          setRatingCount(querySnapshot.size);
        }
      } catch (error) {
        console.error('Error al obtener valoraciones:', error);
      }
    };
    
    fetchUserRatings();
  }, [game.id]);

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg">
      <Link href={`/game/${game.slug}`}>
        <div className="relative h-48">
          <Image
            src={game.background_image || '/placeholder-game.jpg'}
            alt={game.name}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Link href={`/game/${game.slug}`}>
            <h3 className="text-lg font-semibold truncate hover:text-primary">{game.name}</h3>
          </Link>
          <FavoriteButton game={game} />
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Rating rating={avgRating} count={ratingCount > 0 ? ratingCount : undefined} />
        </div>
      </div>
    </div>
  );
}