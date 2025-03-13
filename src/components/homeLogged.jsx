import './homeLogged.css';
import React from "react";

function HomeLogged({ goToGenres }) {
  return (
    <div className="logged-home">
      <button onClick={goToGenres}>Procurar Filmes</button>
      <button>Minha Lista</button>
      <button>Comparar lista com amigos</button>
    </div>
  );
}

export default HomeLogged;
