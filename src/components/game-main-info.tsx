import { GameDetails } from "../types/games.types";

export default function GameMainInfo({ game }: { game: GameDetails }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Desarrolladores</h3>
          {game.developers?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {game.developers.map(dev => (
                <span key={dev.name} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm px-3 py-1 rounded-full">
                  {dev.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No disponible</p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Plataformas</h3>
          {game.platforms?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {game.platforms.map(({ platform }) => (
                <span key={platform.name} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm px-3 py-1 rounded-full">
                  {platform.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No disponible</p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Géneros</h3>
          {game.genres?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {game.genres.map(genre => (
                <span key={genre.name} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm px-3 py-1 rounded-full">
                  {genre.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No disponible</p>
          )}
        </div>
      </div>
      
      {game.website && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Sitio web oficial</h3>
          <a href={game.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all">
            {game.website}
          </a>
        </div>
      )}
    </div>
  );
}