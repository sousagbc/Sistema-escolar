import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (user === "admin" && password === "1234") {
      navigate("/home");
      return;
    }
    setError("Usuário ou senha incorretis.");
  };

  // ---- ESTILOS TIPADOS ----
  const styles: Record<string, React.CSSProperties> = {
   
       container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",           // centraliza verticalmente
      background: "white",     // opcional
    },


    card: {
      width: "350px",
      padding: "30px",
      background: "white",
      borderRadius: "12px",
      boxShadow: "0px 5px 14px rgba(0,0,0,0.25)",
      display: "flex",
      flexDirection: "column", // agora tipado corretamente
      alignItems: "center",
    },

    title: {
      marginBottom: "20px",
      fontSize: "22px",
      color: "#1a237e",
      fontWeight: "bold",
    },

    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },

    button: {
      width: "100%",
      padding: "12px",
      marginTop: "10px",
      background: "#3f51b5",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "0.2s",
    },

    error: {
      color: "red",
      marginBottom: "10px",
      fontSize: "13px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sistema Escolar</h2>

        <input
          type="text"
          placeholder="Usuário"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={styles.button}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "#283593")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "#3f51b5")
          }
          onClick={handleLogin}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}