import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { Home } from './components/Home'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { Perfil } from './components/Perfil'
 
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Perfil' element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  )
}
