import { useState } from "react";
import { Search, Star, Loader } from "lucide-react";

const MovieRatingCard = () => {
  const [movieTitle, setMovieTitle] = useState("");
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY = "b3920e4d";
  const searchMovie = async (e) => {
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
    } catch (err) {
      setError("Failed to fetch movie data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-xl shadow-xl">
      <form onSubmit={searchMovie} className="flex gap-2 mb-6">
        <input
          type="text"
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
          placeholder="Enter movie title..."
          className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="text-red-400 text-center p-4 bg-red-900/20 rounded-lg">
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
                className="w-32 h-auto rounded-lg"
              />
            )}
            <div>
              <h2 className="text-xl font-bold text-white">
                {movieData.Title}
              </h2>
              <p className="text-gray-400">
                {movieData.Year} • {movieData.Runtime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-lg font-bold">{movieData.imdbRating}</span>
            </div>
            <span className="text-gray-400">IMDb rating</span>
          </div>

          <div className="text-sm text-gray-300">{movieData.Plot}</div>

          <div className="flex flex-wrap gap-2">
            {movieData.Genre.split(", ").map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-gray-700 rounded-full text-sm"
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
