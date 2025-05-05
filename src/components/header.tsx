'use client'

import Link from 'next/link';
import { useAuth } from '../context/auth-context';
import { useState } from 'react';

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Fireplay
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-blue-100 hover:text-white transition duration-200 font-medium">
              Juegos
            </Link>

            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/favorites"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <span>❤️</span> Favoritos
                    </Link>
                    <Link href="/cart" className="text-blue-100 hover:text-white transition duration-200 font-medium">
                      Carrito
                    </Link>
                    <div className="relative group">
                      <button className="flex items-center text-blue-100 hover:text-white font-medium">
                        {user.displayName || 'Mi Cuenta'}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 hidden group-hover:block">
                        <Link href="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                          Mi perfil
                        </Link>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-blue-100 hover:text-white transition duration-200 font-medium">
                      Iniciar sesión
                    </Link>
                    <Link href="/register" className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition duration-200">
                      Registrarse
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-600">
            <Link href="/" className="text-blue-100 hover:text-white transition duration-200 font-medium">
  Juegos
</Link>



            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/favorites" className="block py-2 text-blue-100 hover:text-white">
                      Favoritos
                    </Link>
                    <Link href="/cart" className="block py-2 text-blue-100 hover:text-white">
                      Carrito
                    </Link>
                    <Link href="/dashboard" className="block py-2 text-blue-100 hover:text-white">
                      Mi perfil
                    </Link>
                    <button
                      onClick={logout}
                      className="block py-2 text-blue-100 hover:text-white w-full text-left"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block py-2 text-blue-100 hover:text-white">
                      Iniciar sesión
                    </Link>
                    <Link href="/register" className="block py-2 text-blue-100 hover:text-white">
                      Registrarse
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}