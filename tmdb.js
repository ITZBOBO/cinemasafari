// =====================================================
// TMDB API Utility
// Get your free API key at: https://www.themoviedb.org/settings/api
// =====================================================

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "YOUR_API_KEY_HERE";
const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
export const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";

const headers = {
  accept: "application/json",
};

export async function searchMovies(query, page = 1) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

export async function getTrending() {
  const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("Failed to fetch trending");
  return res.json();
}

export async function getMovieDetails(id) {
  const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

export function getRatingColor(rating) {
  if (rating >= 7.5) return "#22c55e";
  if (rating >= 6) return "#f59e0b";
  return "#f87171";
}
