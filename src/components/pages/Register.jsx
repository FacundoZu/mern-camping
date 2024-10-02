import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Peticion } from '../../helpers/Peticion';
import { Global } from '../../helpers/Global';
import { useNavigate } from 'react-router-dom';
import { validarFormulario } from '../../helpers/validarFormulario';
import { AuthContext } from '../../context/AuthContext';
import useAuth from '../../hooks/useAuth';

export const Register = () => {

  const navigate = useNavigate();

  const { formulario, cambiado } = useForm({});
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState(null);
  const { setAuth } = useAuth();

  const guardarUsuario = async (e) => {
    e.preventDefault();

    setMensajeError(null);
    const erroresValidacion = validarFormulario(
      formulario.email,
      formulario.password,
      formulario.password2,
      formulario.name,
      formulario.address,
      formulario.phone
    );
    setErrores(erroresValidacion);
    console.log(erroresValidacion)

    if (Object.keys(erroresValidacion).length === 0) {
      let nuevoUsuario = formulario;
      console.log(nuevoUsuario)

      const { datos } = await Peticion(Global.url + "user/register", "POST", nuevoUsuario, false, 'include');

      if (datos.status === "success") {
        setAuth(datos.user);
        navigate('/');

      } else if (datos.status === "error" && datos.message === "El usuario ya existe") {
        setMensajeError("El usuario ya está registrado. Por favor, intenta con otro email.");
      } else {
        setMensajeError("Error al registrar el usuario. Inténtalo de nuevo más tarde.");
      }
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 p-6 bg-white shadow-md rounded-lg mt-28">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Registro</h1>
        <p className="text-gray-500">Ingresa tu información para crear una cuenta</p>
      </div>
      <div className="space-y-4">
        <form className='space-y-4' onSubmit={guardarUsuario}>
          
          {/* Nombre */}
          <div className="flex flex-col gap-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              id="name" type="text" name="name" placeholder="Tu nombre" required onChange={cambiado}
            />
            {errores.name && <span className="text-red-500 bg-red-600 bg-opacity-10 rounded-lg p-2 mt-3 font-bold text-sm">{errores.name}</span>}
          </div>

          {/* Dirección */}
          <div className="flex flex-col gap-3">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
            <input className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              id="address" type="text" name="address" placeholder="Tu dirección" required onChange={cambiado}
            />
            {errores.address && <span className="text-red-500 bg-red-600 bg-opacity-10 rounded-lg p-2 mt-3 font-bold text-sm">{errores.address}</span>}
          </div>

          {/* Teléfono */}
          <div className="flex flex-col gap-3">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              id="phone" type="text" name="phone" placeholder="Tu teléfono" required onChange={cambiado}
            />
            {errores.phone && <span className="text-red-500 bg-red-600 bg-opacity-10 rounded-lg p-2 mt-3 font-bold text-sm">{errores.phone}</span>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              id="email" type="email" name="email" placeholder="ejemplo@dominio.com" required onChange={cambiado}
            />
            {errores.email && <span className="text-red-500 bg-red-600 bg-opacity-10 rounded-lg p-2 mt-3 font-bold text-sm">{errores.email}</span>}
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-3">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              id="password" type="password" name="password" required onChange={cambiado}
            />
            {errores.password && <span className="text-red-500 bg-red-600 bg-opacity-10 rounded-lg p-2 mt-3 font-bold text-sm">{errores.password}</span>}
          </div>

          {/* Confirmar contraseña */}
          <div className="flex flex-col gap-3">
            <label htmlFor="password2" className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
            <input className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              id="password2" type="password" name="password2" required onChange={cambiado}
            />
            {errores.password2 && <span className="text-red-500 bg-red-600 bg-opacity-10 rounded-lg p-2 mt-3 font-bold text-sm">{errores.password2}</span>}
          </div>

          {mensajeError && <div className="text-red-500 bg-red-600 bg-opacity-10 rounded-lg p-2 mt-3 font-bold text-sm">{mensajeError}</div>} {/* Mostrar mensaje de error */}

          <button
            type="submit"
            className="w-full bg-lime-600 text-white py-2 rounded-md shadow-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};