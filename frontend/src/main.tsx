import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Subjects from './pages/Subjects'
import Classes from './pages/Classes'
import Enrollments from './pages/Enrollments'
import Grades from './pages/Grades'
import './styles.css'

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <header style={{marginBottom:12}}>
          <nav className="nav-links">
            <Link to="/">Alunos</Link>
            <Link to="/teachers">Professores</Link>
            <Link to="/subjects">Matérias</Link>
            <Link to="/classes">Turmas</Link>
            <Link to="/enrollments">Matrículas</Link>
            <Link to="/grades">Notas</Link>
          </nav>
        </header>

        <main>
          <div className="card">
            <Routes>
              <Route path="/" element={<Students/>} />
              <Route path="/teachers" element={<Teachers/>} />
              <Route path="/subjects" element={<Subjects/>} />
              <Route path="/classes" element={<Classes/>} />
              <Route path="/enrollments" element={<Enrollments/>} />
              <Route path="/grades" element={<Grades/>} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
