import React from 'react'
import { Home } from '../components/pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import { Layout } from '../components/layout/Layout'
import { Login } from '../components/pages/usuario/Login'
import { Register } from '../components/pages/usuario/Register'
import { Cabaña } from '../components/pages/cabañas/Cabaña'
import { Perfil } from '../components/pages/usuario/Perfil'
import { Cabañas } from '../components/pages/cabañas/Cabañas'
import { LayoutAdmin } from '../components/adminLayout/LayoutAdmin'
import { AdminDashboard } from '../components/pages/admin/AdminDashboard'
import { AdminCabaña } from '../components/pages/admin/cabañas/AdminCabaña'
import { AdminCrearCabaña } from '../components/pages/admin/cabañas/AdminCrearCabaña'
import { AdminEditarCabaña } from '../components/pages/admin/cabañas/AdminEditarCabaña'
import { AdminServicios } from '../components/pages/admin/servicios/AdminServicios'
import { AdminCrearServicio } from '../components/pages/admin/servicios/AdminCrearServicio'
import { AdminEditarServicio } from '../components/pages/admin/servicios/AdminEditarServicio'
import { AdminActividades } from '../components/pages/admin/actividades/AdminActividades'
import { AdminCrearActividad } from '../components/pages/admin/actividades/AdminCrearActividad'
import { AdminEditarActividad } from '../components/pages/admin/actividades/AdminEditarActividad'
import { AdminPreguntas } from '../components/pages/admin/preguntas/AdminPreguntas'
import { AdminCrearPregunta } from '../components/pages/admin/preguntas/AdminCrearPregunta'
import { AdminEditarPregunta } from '../components/pages/admin/preguntas/AdminEditarPregunta'


export const Routing = () => {
  return (
    <BrowserRouter>

      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/cabañas' element={<Cabañas />} />
          <Route path='/cabaña/:id' element={<Cabaña />} />
          <Route path='/Perfil' element={<PrivateRoute ><Perfil /></PrivateRoute>} />

        </Route>

        <Route element={<PrivateRoute requiredRole="admin"><LayoutAdmin /></PrivateRoute>}>
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/cabañas' element={<AdminCabaña />} />
          <Route path='/admin/CrearCabaña' element={<AdminCrearCabaña />} />
          <Route path='/admin/EditarCabaña/:id' element={<AdminEditarCabaña />} />

          <Route path='/admin/servicios' element={<AdminServicios />} />
          <Route path='/admin/CrearServicio' element={<AdminCrearServicio />} />
          <Route path='/admin/EditarServicio/:id' element={<AdminEditarServicio />} />

          <Route path='/admin/actividades' element={<AdminActividades />} />
          <Route path='/admin/CrearActividad' element={<AdminCrearActividad />} />
          <Route path='/admin/EditarActividad/:id' element={<AdminEditarActividad />} />

          <Route path='/admin/preguntas' element={<AdminPreguntas />} />
          <Route path='/admin/CrearPregunta' element={<AdminCrearPregunta />} />
          <Route path='/admin/EditarPregunta/:id' element={<AdminEditarPregunta />} />
        </Route>

      </Routes>

    </BrowserRouter>
  )
}
