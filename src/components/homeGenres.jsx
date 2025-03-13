import React, { useState } from "react";
import "./homeGenres.css";

function HomeGenres() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [page, setPage] = useState(1);
  const [userList, setUserList] = useState([]);
  const [hoveredMovie, setHoveredMovie] = useState(null);

  const userId = localStorage.getItem("userId") || ""; // Garante que não fique undefined


  if (!userId) {
    console.error("Erro: Usuário não está logado.");
    return;
  }


  const genres = [
    "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime",
    "Documentary", "Drama", "Family", "Fantasy", "Film-Noir", "History",
    "Horror", "Music", "Musical", "Mystery", "Romance", "Sci-Fi", "Short",
    "Sport", "Thriller", "War", "Western"
  ];

  const fetchMoviesByGenre = async (genre, page) => {
    const apiKey = "4737a0b4";
    const url = `http://www.omdbapi.com/?s=${genre}&page=${page}&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.Response === "True") {
        setMovies((prevMovies) => (page === 1 ? data.Search : [...prevMovies, ...data.Search]));
        setSelectedGenre(genre);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      setMovies([]);
    }
  };

  const loadMoreMovies = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMoviesByGenre(selectedGenre, nextPage);
  };

  const addToList = async (movie) => {
    console.log("Enviando userId:", userId); // Verifica se userId está correto
    console.log("Enviando movieId:", movie.imdbID);

    if (!userId) {
        console.error("Erro: Usuário não está logado.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/users/${userId}/add-movie`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ movieId: movie.imdbID, movieTitle: movie.Title }),
        });
        const data = await response.json();
        if (response.ok) {
            setUserList((prevList) => [...prevList, movie]); // Atualiza lista local
        } else {
            alert(data.error || "Erro ao adicionar o filme.");
        }
    } catch (error) {
        console.error("Erro ao adicionar filme:", error);
    }
};



  return (
    <div>
      <h2>Escolha um gênero</h2>
      <div className="genres-grid">
        {genres.map((genre) => (
          <button key={genre} onClick={() => fetchMoviesByGenre(genre, 1)}>
            {genre}
          </button>
        ))}
      </div>

      {movies.length > 0 && (
        <div>
          <h2>Filmes de {selectedGenre}</h2>
          <div className="movies-grid">
            {movies.map((movie) => (
              <div
                key={movie.imdbID}
                className="movie-card"
                onMouseEnter={() => setHoveredMovie(movie.imdbID)}
                onMouseLeave={() => setHoveredMovie(null)}
              >
                <img src={movie.Poster} alt={movie.Title} />
                <h3>{movie.Title}</h3>
                {hoveredMovie === movie.imdbID && (
                  <button
                    className="add-to-list-btn"
                    onClick={() => addToList(movie)}
                  >
                    Adicionar à Lista
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={loadMoreMovies} className="load-more-btn">
            Carregar Mais
          </button>
        </div>
      )}

      <div>
        <h2>Minha Lista</h2>
        <ul>
          {userList.map((movie, index) => (
            <li key={index}>{movie.Title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HomeGenres;
