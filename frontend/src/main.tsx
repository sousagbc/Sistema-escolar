import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Subjects from './pages/Subjects'
import Classes from './pages/Classes'
import Enrollments from './pages/Enrollments'
import Grades from './pages/Grades'

import Login from './pages/login'
import Home from './pages/home'

import './styles.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Página de login */}
        <Route path="/" element={<Login />} />

        {/* Layout principal do sistema */}
        <Route path="/home" element={<Home />}>
          <Route index element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="classes" element={<Classes />} />
          <Route path="enrollments" element={<Enrollments />} />
          <Route path="grades" element={<Grades />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(<App />)