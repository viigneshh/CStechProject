import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import {Routes, Route} from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import RegisterPage from './Pages/register'
import LoginPage from './Pages/login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/register" element={<RegisterPage />} />
       <Route path="/login" element={<LoginPage />} />
    </Routes>
   
  )
}

export default App
