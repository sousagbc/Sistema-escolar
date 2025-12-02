import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // login simples
    if (user === "admin" && password === "1234") {
      navigate("./home");
      return;
    }

    // se senha estiver errada
    setError("Usuário ou senha incorretos.");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sistema Escolar</h2>

        <input
          type="text"
          placeholder="Usuário"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="login-input"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

        <button className="login-button" onClick={handleLogin}>
          Entrar
        </button>
      </div>
    </div>
  );
}