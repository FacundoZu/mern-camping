import React from 'react'
import { Home } from '../components/pages/Home'
import { Login } from '../components/pages/Login'
import { Register } from '../components/pages/Register'
import { Perfil } from '../components/pages/Perfil'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Layout from '../components/layout/Layout'

export const Routing = () => {
  return (
    <BrowserRouter>

      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Perfil' element={<PrivateRoute ><Perfil /></PrivateRoute>} />
        </Route>
      </Routes>

    </BrowserRouter>
  )
}
