import { IMAGE_BASE, getRatingColor } from "../api/tmdb";

const PLACEHOLDER = "https://via.placeholder.com/500x750/1a1a2e/6366f1?text=No+Poster";

function MovieCard({ movie, onClick }) {
  const poster = movie.poster_path
    ? `${IMAGE_BASE}${movie.poster_path}`
    : PLACEHOLDER;

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const ratingColor = getRatingColor(movie.vote_average);

  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      <div className="card-poster">
        <img src={poster} alt={movie.title} loading="lazy" />
        <div className="card-overlay">
          <span className="view-btn">View Details</span>
        </div>
        <div className="rating-badge" style={{ color: ratingColor }}>
          ★ {rating}
        </div>
      </div>
      <div className="card-info">
        <h3 className="card-title">{movie.title}</h3>
        <span className="card-year">{year}</span>
      </div>
    </div>
  );
}

export default MovieCard;
