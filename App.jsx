import { useState, useEffect, useCallback } from "react";
import { searchMovies, getTrending } from "./api/tmdb";
import useDebounce from "./hooks/useDebounce";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const debouncedQuery = useDebounce(query, 500);

  // Load trending on mount
  useEffect(() => {
    getTrending()
      .then((data) => setTrending(data.results || []))
      .catch(() => {});
  }, []);

  // Search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setMovies([]);
      setTotalPages(0);
      setPage(1);
      return;
    }
    handleSearch(debouncedQuery, 1);
  }, [debouncedQuery]);

  const handleSearch = useCallback(async (q, p = 1) => {
    setLoading(true);
    setError("");
    try {
      const data = await searchMovies(q, p);
      if (p === 1) {
        setMovies(data.results || []);
      } else {
        setMovies((prev) => [...prev, ...(data.results || [])]);
      }
      setTotalPages(data.total_pages || 0);
      setPage(p);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLoadMore = () => {
    if (page < totalPages) {
      handleSearch(debouncedQuery, page + 1);
    }
  };

  const handleClear = () => {
    setQuery("");
    setMovies([]);
    setError("");
  };

  const displayMovies = query.trim() ? movies : trending;
  const isSearchMode = query.trim().length > 0;

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🎬</span>
            <span>CineSearch</span>
          </div>
          <SearchBar
            value={query}
            onChange={setQuery}
            onClear={handleClear}
            resultCount={movies.length}
            isSearching={loading}
          />
        </div>
      </header>

      <main className="main">
        {/* Section Label */}
        <div className="section-header">
          <h2>{isSearchMode ? "Search Results" : "🔥 Trending This Week"}</h2>
        </div>

        {/* Error */}
        {error && <p className="error-msg">{error}</p>}

        {/* Loading skeleton */}
        {loading && movies.length === 0 && (
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
        {!loading || movies.length > 0 ? (
          displayMovies.length > 0 ? (
            <div className="grid">
              {displayMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={setSelectedMovie}
                />
              ))}
            </div>
          ) : !loading && isSearchMode ? (
            <div className="empty-state">
              <p>🎭 No movies found. Try a different title.</p>
            </div>
          ) : null
        ) : null}

        {/* Load More */}
        {isSearchMode && page < totalPages && !loading && (
          <div className="load-more-wrapper">
            <button className="load-more-btn" onClick={handleLoadMore}>
              Load More
            </button>
          </div>
        )}

        {loading && movies.length > 0 && (
          <div className="loading-more">Loading more...</div>
        )}
      </main>

      {/* Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default App;
