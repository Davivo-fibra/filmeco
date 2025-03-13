import React, { useState } from "react";
import "./register.css";

const Register = ({ goToLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const checkResponse = await fetch("http://localhost:5000/checkUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const checkData = await checkResponse.json();

      if (checkData.exists) {
        setAlertMessage("Usuário já existe!");
        setAlertType("error");
        return;
      }

      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setAlertMessage(errorMessage);
        setAlertType("error");
      } else {
        setAlertMessage("Usuário cadastrado com sucesso!");
        setAlertType("success");
        setTimeout(() => goToLogin(), 0);
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setAlertMessage("Ocorreu um erro ao cadastrar o usuário.");
      setAlertType("error");
    }
  };

  return (
    <div className="container">
      <h2>Cadastro</h2>
      <form className="register-form" onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-submit">Cadastrar</button>
      </form>
      <button className="btn btn-gologin" onClick={goToLogin}>
        Já tem uma conta? Faça login
      </button>

      {alertMessage && (
        <div className={`alert ${alertType === "error" ? "alert-error" : "alert-success"}`}>
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default Register;
