import React from 'react'
import { Home } from '../components/views/home/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import { Layout } from '../components/layout/Layout'
import { Login } from '../components/views/usuario/Login'
import { Register } from '../components/views/usuario/Register'
import { Cabaña } from '../components/views/cabañas/Cabaña'
import { Cabañas } from '../components/views/cabañas/Cabañas'
import { Perfil } from '../components/views/usuario/Perfil'
import { LayoutAdmin } from '../components/admin/adminLayout/LayoutAdmin'
import { AdminDashboard } from '../components/admin/views/AdminDashboard'
import { AdminCabaña } from '../components/admin/views/cabañas/AdminCabaña'
import { AdminCrearCabaña } from '../components/admin/views/cabañas/AdminCrearCabaña'
import { AdminEditarCabaña } from '../components/admin/views/cabañas/AdminEditarCabaña'
import { AdminServicios } from '../components/admin/views/servicios/AdminServicios'

import { AdminCrearServicio } from '../components/admin/views/servicios/AdminCrearServicio'
import { AdminEditarServicio } from '../components/admin/views/servicios/AdminEditarServicio'
import { AdminActividades } from '../components/admin/views/actividades/AdminActividades'
import { AdminCrearActividad } from '../components/admin/views/actividades/AdminCrearActividad'
import { AdminEditarActividad } from '../components/admin/views/actividades/AdminEditarActividad'
import { AdminPreguntas } from '../components/admin/views/preguntas/AdminPreguntas'
import { AdminCrearPregunta } from '../components/admin/views/preguntas/AdminCrearPregunta'
import { AdminEditarPregunta } from '../components/admin/views/preguntas/AdminEditarPregunta'

import AdminVerCabaña from '../components/admin/views/cabañas/AdminVerCabaña'
import { AdminUsuarios } from '../components/admin/views/usuarios/AdminUsuarios'
import { AdminEditarUsuario } from '../components/admin/views/usuarios/AdminEditarUsuario'


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

        <Route element={<PrivateRoute requiredRoles={['admin', 'gerente']}><LayoutAdmin /></PrivateRoute>}>
          <Route path="/admin/dashboard" element={<PrivateRoute requiredRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/cabañas" element={<AdminCabaña />} />
          <Route path="/admin/CrearCabaña" element={<AdminCrearCabaña />} />
          <Route path="/admin/EditarCabaña/:id" element={<AdminEditarCabaña />} />
          <Route path="/admin/VerCabaña/:id" element={<AdminVerCabaña />} />

          <Route path="/admin/usuarios" element={<PrivateRoute requiredRoles={['admin']}><AdminUsuarios /></PrivateRoute>} />
          <Route path="/admin/EditarUsuario/:id" element={<PrivateRoute requiredRoles={['admin']}><AdminEditarUsuario /></PrivateRoute>} />

          <Route path="/admin/servicios" element={<PrivateRoute requiredRoles={['admin', 'gerente']}><AdminServicios /></PrivateRoute>} />
          <Route path="/admin/CrearServicio" element={<PrivateRoute requiredRoles={['admin', 'gerente']}><AdminCrearServicio /></PrivateRoute>} />
          <Route path="/admin/EditarServicio/:id" element={<PrivateRoute requiredRoles={['admin', 'gerente']}><AdminEditarServicio /></PrivateRoute>} />

          <Route path="/admin/actividades" element={<PrivateRoute requiredRoles={['admin', 'gerente']}><AdminActividades /></PrivateRoute>} />
          <Route path="/admin/CrearActividad" element={<PrivateRoute requiredRoles={['admin', 'gerente']}><AdminCrearActividad /></PrivateRoute>} />
          <Route path="/admin/EditarActividad/:id" element={<PrivateRoute requiredRoles={['admin', 'gerente']}><AdminEditarActividad /></PrivateRoute>} />

          <Route path="/admin/preguntas" element={<PrivateRoute requiredRoles={['admin', 'gerente']}><AdminPreguntas /></PrivateRoute>} />
          <Route path="/admin/CrearPregunta" element={<PrivateRoute requiredRoles={['admin', 'gerente']}><AdminCrearPregunta /></PrivateRoute>} />
          <Route path="/admin/EditarPregunta/:id" element={<PrivateRoute requiredRoles={['admin', 'gerente']}><AdminEditarPregunta /></PrivateRoute>} />
        </Route>

      </Routes>

    </BrowserRouter>
  )
}
