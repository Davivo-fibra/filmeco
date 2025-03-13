import React, { useState, useEffect } from "react";
import Header from "./components/header";
import Home from "./components/home";
import HomeLogged from "./components/homeLogged";
import HomeGenres from "./components/homeGenres";
import Register from "./components/register";
import Login from "./components/login"; 
import './components/app.css';

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(null);

  // Verifica se há um usuário logado ao carregar a página
  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      setUser(loggedUser); // O problema está aqui
      setCurrentPage("homeLogged"); // Garante que o usuário vá direto para a HomeLogged se estiver logado
    }
  }, []);
  
  

  // Função para lidar com o login
  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem("user", username); // Salva o login no navegador
    setCurrentPage("homeLogged"); // Vai para a página de HomeLogged após login
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove o login ao sair
    setCurrentPage("home"); // Vai para a página de Home (deslogado)
  };

  return (
    <div>
      <Header 
        user={user} 
        onLogout={handleLogout} 
        goToLogin={() => setCurrentPage("login")}
        goToRegister={() => setCurrentPage("register")}
      />

      {/* Definindo qual componente de Home mostrar */}
      {currentPage === "home" && !user && <Home />}
      {currentPage === "homeLogged" && user && <HomeLogged goToGenres={() => setCurrentPage("homeGenres")} />}
      {currentPage === "homeGenres" && <HomeGenres />}
      
      {currentPage === "register" && <Register goToLogin={() => setCurrentPage("login")} />}
      {currentPage === "login" && <Login goToRegister={() => setCurrentPage("register")} onLoginSuccess={handleLogin} />}
    </div>
  );
}

export default App;
