'use client';

import { useCart } from '../../context/cart-context';
import Link from 'next/link';
import Image from 'next/image';

// Precio ficticio generado con base en el rating del juego
const calculatePrice = (rating: number | undefined) => {
  // Proporcionar un valor predeterminado si rating es undefined
  const safeRating = rating ?? 0;
  return Math.max(19.99, safeRating * 10).toFixed(2);
};

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();

  const totalPrice = items.reduce((total, item) => {
    // No necesitas hacer parseFloat en toda la función, solo en el resultado final
    return total + (parseFloat(calculatePrice(item.rating)) * item.quantity);
  }, 0).toFixed(2);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6 my-10 text-center">
        <h1 className="text-3xl font-bold mb-6">Tu carrito está vacío</h1>
        <p className="mb-8">No tienes productos en tu carrito de compra.</p>
        <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          Explorar juegos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 my-10">
      <h1 className="text-3xl font-bold mb-6">Carrito de compra</h1>
      
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.id} className="flex items-center border-b pb-4">
            <Image 
              src={item.background_image || '/default-image.jpg'} 
              alt={item.name} 
              width={80}
              height={80}
              className="object-cover rounded-lg"
            />
            
            <div className="ml-4 flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-gray-600">€{calculatePrice(item.rating)}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="px-2 py-1 border rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
            </div>
            
            <button 
              onClick={() => removeFromCart(item.id)}
              className="ml-4 text-red-500"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center py-4 border-t font-bold">
        <span>Total:</span>
        <span>€{totalPrice}</span>
      </div>
      
      <div className="flex justify-between mt-6">
        <button 
          onClick={clearCart}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          Vaciar carrito
        </button>
        
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Finalizar compra
        </button>
      </div>
    </div>
  );
}