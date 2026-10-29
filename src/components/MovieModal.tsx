import { useEffect, useState } from "react";
import type { Genre, Movie } from "../types";
import {
  getBackdropUrl,
  getPosterUrl,
  getPlaceholderPoster,
} from "../data/sampleMovies";
import { resolveGenreNames } from "../utils/genreNames";

type MovieModalProps = {
  movie: Movie;
  genres?: Genre[];
  onClose: () => void;
};

const MovieModal = ({ movie, genres, onClose }: MovieModalProps) => {
  // The overlay is invisible until it has the "active" class,
  // which we add one frame after mounting so the CSS transition plays.
  const [active, setActive] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setActive(true));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    // cleanup: remove the listener when the modal closes
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const releaseFormatted = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : "Unknown Release Date";
  const trailerQuery = encodeURIComponent(
    `${movie.title} trailer ${movie.release_date?.substring(0, 4) ?? ""}`,
  );

  return (
    <div className={`modal-overlay ${active ? "active" : ""}`} onClick={onClose}>
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-movie-title"
        // clicking inside the dialog must not bubble up to the overlay and close it
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" aria-label="Close" onClick={onClose}>
          &times;
        </button>

        <div
          className="modal-backdrop-hero"
          style={{
            backgroundImage: `url('${getBackdropUrl(movie.backdrop_path)}')`,
          }}
        ></div>

        <div className="modal-body">
          <img
            src={
              movie.poster_path
                ? getPosterUrl(movie.poster_path)
                : getPlaceholderPoster(movie.title)
            }
            alt={movie.title}
            className="modal-poster"
            onError={(e) => {
              e.currentTarget.src = getPlaceholderPoster(movie.title);
            }}
          />

          <div className="modal-content-details">
            <h2 className="modal-title" id="modal-movie-title">
              {movie.title}
            </h2>
            {movie.original_title && movie.original_title !== movie.title && (
              <div className="modal-original-title">
                Original Title: {movie.original_title}
              </div>
            )}

            <div className="modal-meta-row">
              <span
                className="rating-badge"
                style={{ fontSize: "0.9rem", padding: "6px 12px" }}
              >
                <svg viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                {rating} / 10
              </span>
              {movie.vote_count ? (
                <span className="modal-meta-item">
                  {movie.vote_count.toLocaleString()} Ratings
                </span>
              ) : null}
              <span className="modal-meta-item">📅 {releaseFormatted}</span>
              {movie.popularity ? (
                <span className="modal-meta-item">
                  🔥 Popularity: {Math.round(movie.popularity)}
                </span>
              ) : null}
            </div>

            <div className="movie-genres-tags" style={{ gap: "8px" }}>
              {resolveGenreNames(movie.genre_ids, genres).map((name) => (
                <span
                  className="genre-tag"
                  key={name}
                  style={{
                    fontSize: "0.78rem",
                    padding: "4px 10px",
                    borderRadius: "6px",
                  }}
                >
                  {name}
                </span>
              ))}
            </div>

            <div className="modal-overview">
              <h4 className="modal-overview-heading">Overview</h4>
              <p>{movie.overview || "No plot synopsis available."}</p>
            </div>

            <div className="modal-footer-actions">
              <a
                href={`https://www.youtube.com/results?search_query=${trailerQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Watch Trailer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
