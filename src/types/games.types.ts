export interface Game {
  id: number | string;
  name: string;
  slug: string;
  background_image?: string;
  rating?: number;
  gameId?: number | string;
  price?: number;
}
  
  // En otro archivo: src/types/game-details.types.ts
  export interface GameDetails {
    id: number;
    name: string;
    slug: string;
    description: string;
    rating: number;
    background_image: string;
    background_image_additional: string;
    website: string;
    platforms: { platform: { name: string } }[];
    released: string;
    developers: { name: string }[];
    genres: { name: string }[];
  }