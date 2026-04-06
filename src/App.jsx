import { useState, useEffect, useCallback, useRef } from "react";
import { searchMovies, getTrending, getGenres, discoverMoviesByGenre } from "./api/tmdb";
import useDebounce from "./hooks/useDebounce";
import useFavorites from "./hooks/useFavorites";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [viewingFavorites, setViewingFavorites] = useState(false);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const debouncedQuery = useDebounce(query, 500);
  const observerRef = useRef();

  // Load trending and genres on mount
  useEffect(() => {
    getTrending().then((data) => setTrending(data.results || [])).catch(() => {});
    getGenres().then((data) => setGenres(data.genres || [])).catch(() => {});
  }, []);

  const fetchMovies = useCallback(async (q, genreId, p = 1) => {
    setLoading(true);
    setError("");
    try {
      let data;
      if (q.trim()) {
        data = await searchMovies(q, p);
      } else if (genreId) {
        data = await discoverMoviesByGenre(genreId, p);
      } else {
        data = await getTrending();
      }
      
      if (p === 1) {
        setMovies(data.results || []);
      } else {
        setMovies((prev) => {
          const newResults = (data.results || []).filter(movie => !prev.find(p => p.id === movie.id));
          return [...prev, ...newResults];
        });
      }
      setTotalPages(data.total_pages || 1);
      setPage(p);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Search or Genre trigger
  useEffect(() => {
    if (viewingFavorites) return;
    
    if (!debouncedQuery.trim() && !selectedGenre) {
      setMovies([]);
      setTotalPages(0);
      setPage(1);
      return;
    }
    fetchMovies(debouncedQuery, selectedGenre, 1);
  }, [debouncedQuery, selectedGenre, viewingFavorites, fetchMovies]);

  const handleLoadMore = useCallback(() => {
    if (page < totalPages && !loading) {
      fetchMovies(debouncedQuery, selectedGenre, page + 1);
    }
  }, [page, totalPages, loading, debouncedQuery, selectedGenre, fetchMovies]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (viewingFavorites) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        handleLoadMore();
      }
    }, { threshold: 0.1 });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, [handleLoadMore, viewingFavorites]);

  const handleClear = () => {
    setQuery("");
    setMovies([]);
    setError("");
  };

  const isSearchMode = query.trim().length > 0;
  const displayMovies = viewingFavorites ? favorites : (isSearchMode || selectedGenre ? movies : trending);

  const handleGenreClick = (genreId) => {
    setQuery(""); // Clear search when picking genre
    setSelectedGenre(prev => prev === genreId ? null : genreId);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🎬</span>
            <span>CineSearch</span>
          </div>
          <div className="nav-links">
            <button className={`nav-link-btn ${!viewingFavorites ? 'active' : ''}`} onClick={() => { setViewingFavorites(false); setSelectedGenre(null); setQuery(""); }}>Home</button>
            <button className={`nav-link-btn ${viewingFavorites ? 'active' : ''}`} onClick={() => setViewingFavorites(true)}>Favorites</button>
          </div>
          {!viewingFavorites && (
            <SearchBar
              value={query}
              onChange={setQuery}
              onClear={handleClear}
              resultCount={movies.length}
              isSearching={loading}
              suggestions={isSearchMode ? movies.slice(0, 5) : []}
              onSelectSuggestion={(movie) => setSelectedMovie(movie)}
            />
          )}
        </div>
      </header>

      {!viewingFavorites && !isSearchMode && genres.length > 0 && (
        <div className="genres-bar">
          {genres.map(g => (
            <button 
              key={g.id} 
              className={`genre-filter-btn ${selectedGenre === g.id ? 'active' : ''}`}
              onClick={() => handleGenreClick(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

      <main className="main">
        {/* Section Label */}
        <div className="section-header">
          <h2>
            {viewingFavorites ? "❤️ Your Favorites" : 
             isSearchMode ? "Search Results" : 
             selectedGenre ? `${genres.find(g => g.id === selectedGenre)?.name} Movies` : 
             "🔥 Trending This Week"}
          </h2>
        </div>

        {/* Error */}
        {error && <p className="error-msg">{error}</p>}

        {/* Loading skeleton */}
        {loading && page === 1 && (
          <div className="grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-poster" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            ))}
          </div>
        )}

        {/* Movie Grid */}
        <div className="grid">
          {displayMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={setSelectedMovie}
              isFavorite={isFavorite(movie.id)}
              onToggleFavorite={(e) => toggleFavorite(movie, e)}
            />
          ))}
        </div>
        
        {/* Empty States */}
        {!loading && displayMovies.length === 0 && (
          <div className="empty-state">
            {viewingFavorites ? <p>You haven't added any favorites yet! ❤️</p> : <p>🎭 No movies found. Try a different title.</p>}
          </div>
        )}

        {/* Infinite Scroll trigger / Loader */}
        {!viewingFavorites && (isSearchMode || selectedGenre) && page < totalPages && (
          <div ref={observerRef} className="load-more-wrapper">
            {loading ? <div className="loading-more">Loading more...</div> : <div style={{ height: '20px' }}></div>}
          </div>
        )}

      </main>

      {/* Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onSelectMovie={setSelectedMovie}
        />
      )}

      <footer className="footer">
        <p>Developed by itzbobo(shazeat)</p>
      </footer>
    </div>
  );
}

export default App;
