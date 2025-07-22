import { useState } from "react";
import css from "./App.module.css";
import { Toaster, toast } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  // 1. Оголошуємо і типізуємо стан
  const [movies, setMovies] = useState<Movie[]>([]);
  // 2. Додаємо стан індикотора загрузки
  const [isLoading, setIsLoading] = useState(false);
  // Додаємо стан isError
  const [isError, setIsError] = useState(false);
  // Модал
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSubmit = async (searchValue: string) => {
    setMovies([]); // щчищуємо попередні фільми після пового запиту
    // 2. змінюємо індикатор на true перед запитом
    setIsLoading(true);
    setIsError(false);

    try {
      const fetchedMovies = await fetchMovies(searchValue);
      if (fetchedMovies.length === 0) {
        toast.error("No movies found for your request.");
      }
      // 3. Меняем индикатор на false после запроса
      setMovies(fetchedMovies);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error fetching movies: ${error.message}`);
      } else {
        toast.error("Error fetching movies.");
      }
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (movie: Movie) => {
    if (!movie) return; // захист від некоректних даних
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <div className={css.app}>
        <Toaster position="top-center" />
        <SearchBar onSubmit={handleSubmit} />
        {isLoading ? (
          <Loader />
        ) : (
          movies.length > 0 && (
            <MovieGrid onSelect={handleSelect} movies={movies} />
          )
        )}
        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={closeModal} />
        )}
        {isError && <ErrorMessage />}
      </div>
    </>
  );
}