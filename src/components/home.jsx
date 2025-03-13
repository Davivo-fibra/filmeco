import React, { useState } from "react";
import HomeLogged from "./homeLogged"; // Página inicial do usuário logado
import HomeGenres from "./homeGenres"; // Página de busca de filmes por gênero
import "./home.css";

function Home({ user }) {
  const [currentPage, setCurrentPage] = useState("home"); // Controla qual página mostrar

  const handleSearchClick = () => {
    setCurrentPage("homeGenres"); // Muda para a página de buscar filmes
  };

  return (
    <main>
      {user ? (
        currentPage === "home" ? (
          <HomeLogged onSearchClick={handleSearchClick} /> // Mostra HomeLogged
        ) : (
          <HomeGenres /> // Mostra SearchMovies
        )
      ) : (
        <div class="about">
        <div class="row">
            <div class="col">
                <h2>O que é FilmeCo?</h2>
                <p>FilmeCo é um site onde você pode criar sua própria lista de filmes para assistir e facilitar a escolha de filmes para ver junto com amigos.</p>
            </div>
        </div>
        <div class="row feature-showcase">
            <div class="col text-showcase">
                <h2>Crie sua conta</h2>
                <p>
                    Criar sua conta é fácil, só precisamos de seu nome e uma senha para começar a usar o site.
                </p>
            </div>
        </div>
        <div class="row feature-showcase">
            <div class="col text-showcase">
                <h2>Monte sua lista</h2>
                <p>
                    Adicione filmes à sua lista com apenas alguns cliques. Organize os filmes que você quer assistir ou que já viu.
                </p>
            </div>
        </div>
        <div class="row feature-showcase">
            <div class="col text-showcase">
                <h2>Decida qual filme assistir</h2>
                <p>
                    Escolha o filme perfeito para assistir com seus amigos! Veja sugestões baseadas na sua lista e de seus amigos.
                </p>
            </div>
        </div> 

    </div>
      )}
    </main>
  );
}

export default Home;