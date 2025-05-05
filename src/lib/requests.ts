import axios from 'axios';
import { Game, GameDetails } from '../types/games.types';

const API_URL = process.env.NEXT_PUBLIC_RAWG_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

export async function getSearchedGames(query: string): Promise<Game[]> {
  const url = `${API_URL}/games?key=${API_KEY}&search=${query}`;
  const { data } = await axios.get(url);
  return data.results;
}

export async function getGameDetails(slug: string): Promise<GameDetails> {
  const url = `${API_URL}/games/${slug}?key=${API_KEY}`;
  const { data } = await axios.get(url);
  return data;
}