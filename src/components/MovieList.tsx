import type { Movie } from '../types';
import MovieCard from './movieCard';

interface MovieListProps {
  movies: Movie[];
}

export default function MovieList({ movies }: MovieListProps) {
  if (movies.length === 0) {
    return <p className="empty-state">No movies found</p>;
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}