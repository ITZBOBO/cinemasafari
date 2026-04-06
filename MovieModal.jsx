import { useEffect, useState } from "react";
import { getMovieDetails, IMAGE_BASE, BACKDROP_BASE, getRatingColor } from "../api/tmdb";

const PLACEHOLDER_POSTER = "https://via.placeholder.com/500x750/1a1a2e/6366f1?text=No+Poster";

function MovieModal({ movie, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovieDetails(movie.id)
      .then(setDetails)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [movie.id]);

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const backdrop = movie.backdrop_path
    ? `${BACKDROP_BASE}${movie.backdrop_path}`
    : null;

  const poster = movie.poster_path
    ? `${IMAGE_BASE}${movie.poster_path}`
    : PLACEHOLDER_POSTER;

  const ratingColor = getRatingColor(movie.vote_average);
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const cast = details?.credits?.cast?.slice(0, 5) || [];
  const genres = details?.genres || [];
  const runtime = details?.runtime;
  const formatRuntime = (mins) => {
    if (!mins) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Backdrop */}
        {backdrop && (
          <div
            className="modal-backdrop-img"
            style={{ backgroundImage: `url(${backdrop})` }}
          />
        )}
        <div className="modal-backdrop-overlay" />

        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-content">
          <img className="modal-poster" src={poster} alt={movie.title} />

          <div className="modal-details">
            <h2 className="modal-title">{movie.title}</h2>

            <div className="modal-meta">
              <span className="modal-year">{year}</span>
              {formatRuntime(runtime) && (
                <span className="modal-runtime">{formatRuntime(runtime)}</span>
              )}
              <span className="modal-rating" style={{ color: ratingColor }}>
                ★ {movie.vote_average?.toFixed(1)} / 10
              </span>
            </div>

            {genres.length > 0 && (
              <div className="modal-genres">
                {genres.map((g) => (
                  <span key={g.id} className="genre-tag">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {movie.overview && (
              <p className="modal-overview">{movie.overview}</p>
            )}

            {!loading && cast.length > 0 && (
              <div className="modal-cast">
                <h4>Cast</h4>
                <div className="cast-list">
                  {cast.map((c) => (
                    <div key={c.id} className="cast-item">
                      {c.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                          alt={c.name}
                        />
                      ) : (
                        <div className="cast-avatar-placeholder">
                          {c.name[0]}
                        </div>
                      )}
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="modal-loading">Loading details...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
