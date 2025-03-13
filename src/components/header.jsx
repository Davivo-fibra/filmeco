import React from "react";
import "./header.css";

const Header = ({ goToLogin, goToRegister, user, onLogout, }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <button onClick={() => window.location.href = "/"}>
          <img src="/images/logo.png" alt="FilmeCo" style={{ cursor: "pointer" }} />
        </button>
      </div>

      {/* Se o usuário estiver logado, mostra o nome e o botão de logout */}
      <div className="buttons-login">
        {user ? (
          <>
            <span className="username">{user}</span>
            <button onClick={onLogout} className="btn btn-logout">Logout</button>
          </>
        ) : (
          <>
            <button onClick={goToLogin} className="btn btn-login">Login</button>
            <button onClick={goToRegister} className="btn btn-signup">Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
