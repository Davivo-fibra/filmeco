import React, { useState } from "react";
import "./login.css";

const Login = ({ goToRegister, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      console.log("Resposta do servidor:", data); // Verificar se o token está correto
  
      if (!response.ok) {
        setAlertMessage(data.message || "Erro ao fazer login.");
        setAlertType("error");
      } else {
        setAlertMessage("Login realizado com sucesso!");
        setAlertType("success");
  
        if (data.token) {
          // Decodifica o token para obter o userId
          const payload = JSON.parse(atob(data.token.split(".")[1])); 
          const userId = payload.userId; 
  
          if (userId) {
            localStorage.setItem("userId", userId);
            console.log("UserID salvo:", userId); 
          } else {
            console.error("Erro: userId não encontrado no token.");
          }
        } else {
          console.error("Erro: Token não retornado pelo backend.");
        }
  
        setTimeout(() => {
          onLoginSuccess(username);
        }, 0);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setAlertMessage("Ocorreu um erro ao fazer login.");
      setAlertType("error");
    }
  };
  

  return (
    <div className="container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="username"
          type="text"
          placeholder="Nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="password"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-submit">Entrar</button>
      </form>
      <button className="btn btn-goregister" onClick={goToRegister}>
        Ainda não tem uma conta? Cadastre-se
      </button>

      {alertMessage && (
        <div className={`alert ${alertType === "error" ? "alert-error" : "alert-success"}`}>
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default Login;
