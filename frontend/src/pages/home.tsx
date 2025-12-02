import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <header style={{ marginBottom: 12 }}>
        <nav className="nav-links">
          <Link to="/home">Alunos</Link>
          <Link to="/home/teachers">Professores</Link>
          <Link to="/home/subjects">Matérias</Link>
          <Link to="/home/classes">Turmas</Link>
          <Link to="/home/enrollments">Matrículas</Link>
          <Link to="/home/grades">Notas</Link>
        </nav>
      </header>

      <main>
        <div className="card">
          <Outlet />
        </div>
      </main>
    </div>
  );
}