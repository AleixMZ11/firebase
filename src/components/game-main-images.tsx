'use client';

import { useState } from 'react';
import { GameDetails } from "../types/games.types";

export default function GameMainImages({ game }: { game: GameDetails }) {
  const [selectedImage, setSelectedImage] = useState(game.background_image);
  
  const images = [
    game.background_image,
    ...(game.background_image_additional ? [game.background_image_additional] : []),
  ];

  return (
    <div className="mb-10">
      <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden mb-4">
        <img 
          src={selectedImage} 
          alt={game.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`relative h-20 md:h-24 rounded-md overflow-hidden cursor-pointer transition ${
                selectedImage === image ? 'ring-2 ring-blue-500' : 'opacity-80 hover:opacity-100'
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <img 
                src={image} 
                alt={`${game.name} - imagen ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}