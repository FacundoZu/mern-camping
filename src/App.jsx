import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { Home } from './components/pages/Home'
import { Login } from './components/pages/Login'
import { Register } from './components/pages/Register'
import { Perfil } from './components/pages/Perfil'
import Header from './components/layout/Header'
 
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Perfil' element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  )
}
