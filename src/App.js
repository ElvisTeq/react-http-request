import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
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
      const response = await fetch(
        "https://react-http-58740-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      // Data is stored as an {object}
      const data = await response.json();

      const loadedMovies = [];

      // Looping into a {object with data}, to get/store data into a Array
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
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

  // Sending POST request
  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://react-http-58740-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie), // Convert to JSON
        // Describing content (technically not required but good to do)
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json;
    console.log(data);
  }

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
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
