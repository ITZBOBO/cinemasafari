import { useState, useEffect } from "react";

export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("cinesearch_favorites");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cinesearch_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movie, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (favorites.find((m) => m.id === movie.id)) {
      setFavorites(favorites.filter((m) => m.id !== movie.id));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  const isFavorite = (id) => {
    return !!favorites.find((m) => m.id === id);
  };

  return { favorites, toggleFavorite, isFavorite };
}
