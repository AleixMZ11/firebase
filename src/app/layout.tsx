import "./globals.css";
import { ReactNode } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthProvider from "../context/auth-context";
import CartProvider from "../context/cart-context";

export const metadata = {
  title: 'Fireplay - Tu tienda de juegos',
  description: 'Tienda online de videojuegos',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}