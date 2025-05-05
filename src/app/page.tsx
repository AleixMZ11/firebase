import { getSearchedGames } from "../lib/requests";
import GameCard from "../components/card";
import { Game } from "../types/games.types";

export default async function HomePage() {
  // Obtener juegos populares (ejemplo: zelda)
  const zelda = await getSearchedGames("zelda");
  
  // Obtener juegos de diferentes categorías (ejemplo: fifa)
  const fifa = await getSearchedGames("fifa");

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80" 
          alt="Gaming Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 py-16 px-6 md:py-24 md:px-12 text-white max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Bienvenido a Fireplay</h1>
          <p className="text-lg md:text-xl mb-8">Descubre los mejores juegos al mejor precio</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#popular" className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition">
              Ver juegos populares
            </a>
            <a href="#new" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition">
              Nuevos lanzamientos
            </a>
          </div>
        </div>
      </section>
      
      {/* Sección de juegos populares */}
      <section id="popular" className="scroll-mt-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Juegos de Zelda</h2>
          <a href="/?search=zelda" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            Ver todos →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {zelda.slice(0, 4).map((game: Game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
      
      {/* Sección de nuevos juegos */}
      <section id="new" className="scroll-mt-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Juegos de FIFA</h2>
          <a href="/?search=fifa" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            Ver todos →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fifa.slice(0, 4).map((game: Game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
      
      {/* Banner promocional */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-6 md:p-10 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Únete a nuestra comunidad</h2>
            <p className="text-purple-100 mb-4">Recibe ofertas exclusivas, noticias y recomendaciones personalizadas.</p>
            <a href="/register" className="inline-block bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-lg font-medium transition">
              Registrarse ahora
            </a>
          </div>
          <div className="hidden md:block">
            <img src="/images/controller.png" alt="Game Controller" className="w-40 h-40" />
          </div>
        </div>
      </section>
    </div>
  );
}