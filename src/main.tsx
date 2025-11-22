import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { Presentation } from './pages/Presentation'
import './styles/obsidian.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/presentation" element={<Presentation />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)
