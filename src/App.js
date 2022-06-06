import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // useCallBack() only runs when one of its dependencies update
  // => To avoid infnite loop with useEffect()
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  // Fetch data automatically at the end of event cycle & []
  // NOTE => for best practice we added [fetchMoviesHandler] instead of an empthy []
  // then => useCallBack() To avoid infnite loop with useEffect()
  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  // Default message
  let content = <p>Found no movies.</p>;

  // Success message
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  // Error message
  if (error) {
    content = <p>{error}</p>;
  }

  // Loading messsage
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
