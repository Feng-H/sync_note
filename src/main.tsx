import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { Presentation } from './pages/Presentation'
import './styles/obsidian.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/presentation" element={<Presentation />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
