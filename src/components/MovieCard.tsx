import { useState } from "react";
import type { Genre, Movie } from "../types";
import { getPosterUrl, getPlaceholderPoster } from "../data/sampleMovies";
import { resolveGenreNames } from "../utils/genreNames";

interface MovieCardProps {
  movie: Movie;
  genres?: Genre[];
  onMovieClick?: (movie: Movie) => void;
}

const MovieCard = ({ movie, genres, onMovieClick }: MovieCardProps) => {
  const [isFavourite, setIsFavourite] = useState(false);

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "—";

  const handleFavouriteClick = (e: React.MouseEvent) => {
    // don't let the click bubble up and open the modal
    e.stopPropagation();
    setIsFavourite((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // only react when the card itself is focused, not the heart button inside it
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onMovieClick?.(movie);
    }
  };

  const favouriteLabel = isFavourite
    ? "Remove from favourites"
    : "Add to favourites";

  return (
    <article
      className="movie-card"
      tabIndex={0}
      aria-label={movie.title}
      onClick={() => onMovieClick?.(movie)}
      onKeyDown={handleKeyDown}
    >
      <div className="poster-wrapper">
        <img
          src={
            movie.poster_path
              ? getPosterUrl(movie.poster_path)
              : getPlaceholderPoster(movie.title)
          }
          alt={movie.title}
          className="poster-img"
          loading="lazy"
        />
        <div className="poster-overlay">
          <div className="card-top-badges">
            <span className="rating-badge">
              <svg viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              {(movie.vote_average ?? 0).toFixed(1)}
            </span>
            <button
              className={`favorite-btn ${isFavourite ? "is-favorite" : ""}`}
              title={favouriteLabel}
              aria-label={favouriteLabel}
              onClick={handleFavouriteClick}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isFavourite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
          <span className="quick-view-hint" role="button" tabIndex={-1}>
            View Details
          </span>
        </div>
      </div>
      <div className="movie-card-info">
        <h2 className="movie-card-title">{movie.title}</h2>
        <div className="movie-card-meta">
          <span>{releaseYear}</span>
          <span>{movie.vote_count ?? 0} votes</span>
        </div>
        <div className="movie-genres-tags">
          {resolveGenreNames(movie.genre_ids, genres)
            .slice(0, 3)
            .map((name) => (
              <span className="genre-tag" key={name}>
                {name}
              </span>
            ))}
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
