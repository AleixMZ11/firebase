'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth-context';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Game } from '../../types/games.types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchUserData() {
      try {
        // Asegurar que user no sea nulo dentro de esta función
        if (!user) {
          setLoadingData(false);
          return;
        }

        // Obtener favoritos
        const q = query(
          collection(db, 'favorites'),
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const favoritesData = querySnapshot.docs.map(doc => doc.data() as Game);
        setFavorites(favoritesData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoadingData(false);
      }
    }

    fetchUserData();
  }, [user, loading, router]);

  if (loading || loadingData) {
    return (
      <div className="p-8 text-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 my-10">
      <h1 className="text-3xl font-bold mb-8">Mi cuenta</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center text-2xl">
            {user?.displayName?.[0] || user?.email?.[0] || '?'}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.displayName || 'Usuario'}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-2">Detalles de la cuenta</h3>
          <p className="text-sm text-gray-600">Usuario desde: {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Desconocido'}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Mis favoritos ({favorites.length})</h2>
        
        {favorites.length === 0 ? (
          <p className="text-gray-500">No tienes juegos favoritos todavía.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.slice(0, 4).map(game => (
              <Link href={`/game/${game.slug}`} key={game.id}>
                <div className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
                  <img 
                    src={game.background_image} 
                    alt={game.name} 
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{game.name}</p>
                    <p className="text-sm text-gray-500">Rating: {game.rating}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {favorites.length > 0 && (
          <Link href="/favorites" className="text-[var(--color-primary)] block text-center mt-4">
            Ver todos
          </Link>
        )}
      </div>
    </div>
  );
}