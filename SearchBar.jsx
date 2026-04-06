function SearchBar({ value, onChange, onClear, resultCount, isSearching }) {
  return (
    <div className="searchbar-wrapper">
      <div className="searchbar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search movies..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />
        {value && (
          <button className="clear-btn" onClick={onClear}>
            ✕
          </button>
        )}
      </div>
      {value && !isSearching && (
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
