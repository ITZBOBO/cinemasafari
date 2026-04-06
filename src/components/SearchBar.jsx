import { useState, useRef, useEffect } from "react";

function SearchBar({ value, onChange, onClear, resultCount, isSearching, suggestions = [], onSelectSuggestion }) {
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="searchbar-wrapper" ref={wrapperRef}>
      <div className="searchbar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search movies..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          autoFocus
        />
        {value && (
          <button className="clear-btn" onClick={onClear}>
            ✕
          </button>
        )}
      </div>

      {isFocused && value && !isSearching && (
        <ul className="suggestions-dropdown">
          {suggestions.length > 0 ? (
            suggestions.map((movie) => (
              <li key={movie.id} className="suggestion-item" onClick={() => {
                onSelectSuggestion(movie);
                setIsFocused(false);
              }}>
                <img
                  className="suggestion-poster"
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : "https://via.placeholder.com/92x138?text=!"}
                  alt={movie.title}
                />
                <div className="suggestion-info">
                  <span className="suggestion-title">{movie.title}</span>
                  <span className="suggestion-year">
                    {movie.release_date ? movie.release_date.substring(0, 4) : "N/A"}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <li className="suggestion-empty">No matching movies found</li>
          )}
        </ul>
      )}

      {value && !isSearching && (!isFocused || suggestions.length === 0) && (
        <p className="result-count">
          {resultCount > 0
            ? `${resultCount} result${resultCount !== 1 ? "s" : ""} for "${value}"`
            : `No results for "${value}"`}
        </p>
      )}
    </div>
  );
}

export default SearchBar;
