import { useEffect, useState } from "react";
import { getMovieDetails, IMAGE_BASE, BACKDROP_BASE, getRatingColor } from "../api/tmdb";

const PLACEHOLDER_POSTER = "https://via.placeholder.com/500x750/1a1a2e/6366f1?text=No+Poster";

function MovieModal({ movie, onClose, onSelectMovie }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
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

  const videos = details?.videos?.results || [];
  const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube") || videos.find(v => v.site === "YouTube");
  const similar = details?.similar?.results?.slice(0, 5) || [];

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

            <div className="watch-action" style={{ marginBottom: "20px" }}>
              <a 
                href={`https://www.themoviedb.org/movie/${movie.id}/watch`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="watch-btn"
              >
                ▶ Where to Watch
              </a>
            </div>

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

            {!loading && trailer && (
              <div className="modal-trailer" style={{ marginTop: '24px' }}>
                <h4>Trailer</h4>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', marginTop: '12px' }}>
                  <iframe 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    src={`https://www.youtube.com/embed/${trailer.key}`} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    title="Movie Trailer"
                  />
                </div>
              </div>
            )}

            {!loading && similar.length > 0 && onSelectMovie && (
              <div className="modal-similar" style={{ marginTop: '24px' }}>
                <h4>Similar Movies</h4>
                <div className="similar-list" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px', marginTop: '12px' }}>
                  {similar.map(sm => (
                    <div 
                      key={sm.id} 
                      className="similar-item" 
                      onClick={() => onSelectMovie(sm)}
                      style={{ cursor: 'pointer', flexShrink: 0, width: '90px' }}
                    >
                      <img 
                        src={sm.poster_path ? `${IMAGE_BASE}${sm.poster_path}` : PLACEHOLDER_POSTER} 
                        alt={sm.title} 
                        style={{ width: '100%', height: '135px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div style={{ fontSize: '0.75rem', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {sm.title}
                      </div>
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
