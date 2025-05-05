'use client';

import { useState } from 'react';
import { useCart } from '../context/cart-context';
import { Game } from '../types/games.types';

export default function AddToCartButton({ game }: { game: Game }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = () => {
    setLoading(true);
    
    // Verificar que el juego tiene ID
    if (!game || !game.id) {
      console.error('Error: El juego no tiene un ID válido', game);
      setLoading(false);
      return;
    }
    
    try {
      const gameToAdd = {
        id: game.id,
        name: game.name || 'Juego sin nombre',
        slug: game.slug || '',
        background_image: game.background_image || '/placeholder-game.jpg',
        rating: game.rating || 0,
        price: 19.99 // Añadir un precio por defecto
      };
      
      addToCart(gameToAdd);
      
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`px-6 py-2 rounded-lg text-white font-medium transition ${
        loading ? 'bg-gray-500 cursor-not-allowed' :
        added ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {loading ? 'Añadiendo...' : added ? 'Añadido ✓' : 'Añadir al carrito'}
    </button>
  );
}