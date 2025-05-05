'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from './auth-context';
import { Game } from '../types/games.types';

interface CartItem extends Game {
  quantity: number;
  price?: number; 
}

interface CartContextType {
  items: CartItem[];
  addToCart: (game: Game) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Cargar carrito cuando cambia el usuario
  useEffect(() => {
    async function loadCart() {
      try {
        if (user) {
          // Si hay usuario, intentar cargar desde Firebase
          const cartRef = doc(db, 'carts', user.uid);
          const cartDoc = await getDoc(cartRef);
          
          if (cartDoc.exists()) {
            const cartData = cartDoc.data();
            setItems(cartData.items || []);
          }
        } else {
          // Si no hay usuario, cargar desde localStorage
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            setItems(JSON.parse(savedCart));
          }
        }
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
      }
    }
    
    loadCart();
  }, [user]);

  // Guardar carrito cuando cambia
  useEffect(() => {
    try {
      if (user) {
        // Guardar en Firestore de manera asíncrona
        const saveToFirestore = async () => {
          try {
            await setDoc(doc(db, 'carts', user.uid), { items });
            console.log('Carrito guardado en Firestore');
          } catch (error) {
            console.error('Error al guardar carrito en Firestore:', error);
          }
        };
        
        saveToFirestore();
      } else {
        // Guardar en localStorage
        localStorage.setItem('cart', JSON.stringify(items));
      }
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
  }, [items, user]);

// Y luego en la función addToCart, asegurarte de que se añada el precio
const addToCart = (game: Game) => {
  console.log('Añadiendo al carrito:', game);
  
  if (!game || !game.id) {
    console.error('Error: Intentando añadir un juego sin ID al carrito', game);
    return;
  }
  
  setItems(prevItems => {
    const gameId = typeof game.id === 'string' ? game.id : String(game.id);
    const existingItem = prevItems.find(item => 
      (typeof item.id === 'string' ? item.id : String(item.id)) === gameId
    );
    
    if (existingItem) {
      return prevItems.map(item => 
        (typeof item.id === 'string' ? item.id : String(item.id)) === gameId
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
    } else {
      // Añadir un precio por defecto si no existe
      return [...prevItems, { 
        ...game, 
        quantity: 1,
        price: 19.99 // Precio por defecto
      }];
    }
  });
  
  console.log('Juego añadido al carrito correctamente');
};



  const removeFromCart = (id: number | string) => {
    const idStr = String(id);
    setItems(prevItems => prevItems.filter(item => 
      String(item.id) !== idStr
    ));
  };

  const updateQuantity = (id: number | string, quantity: number) => {
    const idStr = String(id);
    setItems(prevItems => 
      prevItems.map(item => 
        String(item.id) === idStr ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

// Y finalmente modificar el cálculo del total para manejar el caso donde price puede ser undefined
const total = items.reduce(
  (sum, item) => sum + (item.price || 19.99) * item.quantity, 
  0
);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
}