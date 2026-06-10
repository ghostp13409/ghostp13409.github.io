import { useState } from "react";
import type { FC, FormEvent } from "react";
import { Search, Star, Loader } from "lucide-react";

interface MovieData {
  Title: string;
  Year: string;
  Runtime: string;
  imdbRating: string;
  Plot: string;
  Genre: string;
  Poster: string;
  Response: string;
}

const MovieRatingCard: FC = () => {
  const [movieTitle, setMovieTitle] = useState("");
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_KEY = "b3920e4d";

  const searchMovie = async (e: FormEvent) => {
    e.preventDefault();
    if (!movieTitle.trim()) return;

    setLoading(true);
    setError(null);
    setMovieData(null);

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?t=${encodeURIComponent(
          movieTitle
        )}&apikey=${API_KEY}`
      );
      const data = await response.json();

      if (data.Response === "True") {
        setMovieData(data);
      } else {
        setError("Movie not found!");
      }
    } catch {
      setError("Failed to fetch movie data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-surface/60 backdrop-blur-xl rounded-lg shadow-2xl border border-border">
      <form onSubmit={searchMovie} className="flex gap-2 mb-6">
        <input
          type="text"
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
          placeholder="Enter movie title..."
          className="flex-1 px-4 py-2 bg-neutral-bg/60 rounded-md focus:ring-1 focus:ring-primary/50 outline-none text-ink border border-border placeholder-ink/40"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary rounded-md hover:bg-primary/80 transition-all text-neutral-bg font-bold shadow-lg shadow-primary/20"
          disabled={loading}
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>
      </form>

      {error && (
        <div className="text-accent text-center p-4 bg-accent/10 border border-accent/20 rounded-md text-sm">
          {error}
        </div>
      )}

      {movieData && (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            {movieData.Poster !== "N/A" && (
              <img
                src={movieData.Poster}
                alt={movieData.Title}
                className="w-32 h-auto rounded-md border border-border shadow-lg"
              />
            )}
            <div>
              <h2 className="text-xl font-bold text-ink tracking-tight">
                {movieData.Title}
              </h2>
              <p className="text-ink/40 text-sm font-mono mt-1">
                {movieData.Year} • {movieData.Runtime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-lg font-bold text-ink">{movieData.imdbRating}</span>
            </div>
            <span className="text-ink/40 text-xs uppercase tracking-widest font-mono">IMDb Score</span>
          </div>

          <div className="text-sm text-ink/80 leading-relaxed italic border-l-2 border-primary/20 pl-4">{movieData.Plot}</div>

          <div className="flex flex-wrap gap-2">
            {movieData.Genre.split(", ").map((genre) => (
              <span
                key={genre}
                className="px-2.5 py-1 bg-surface border border-border text-ink/60 rounded-sm text-[10px] font-mono uppercase tracking-wider"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieRatingCard;
