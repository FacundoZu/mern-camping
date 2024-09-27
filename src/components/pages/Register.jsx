import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Peticion } from '../../helpers/Peticion';
import { Global } from '../../helpers/Global';
import { useNavigate } from 'react-router-dom';

export const Register = () => {

  const navigate = useNavigate();
  
  const { formulario, cambiado } = useForm({});
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState(null); // Estado para el mensaje de error

  const validarFormulario = () => {
    let errores = {};

    // Validar que el email sea correcto
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(formulario.email)) {
      errores.email = "El correo electrónico no es válido";
    }

    // Validar que las contraseñas coincidan
    if (formulario.password !== formulario.password2) {
      errores.password2 = "Las contraseñas no coinciden";
    }

    return errores;
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    // Limpiar mensajes previos
    setMensajeError(null);
    const erroresValidacion = validarFormulario();
    setErrores(erroresValidacion);

    if (Object.keys(erroresValidacion).length === 0) {
      // Si no hay errores, proceder a enviar los datos
      let nuevoUsuario = formulario;

      // Guardar el contenido en la BD
      const { datos } = await Peticion(Global.url + "user/register", "POST", nuevoUsuario,false, 'include');

      if (datos.status === "success") {
        navigate('/');

      } else if (datos.status === "error" && datos.message === "El usuario ya existe") {
        // Manejo del error cuando el usuario ya existe
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
          <div className="flex flex-col gap-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              id="email" type="email" name="email" placeholder="ejemplo@dominio.com" required onChange={cambiado}
            />
            {errores.email && <span className="text-red-500 bg-red-600 bg-opacity-10 rounded-lg p-2 mt-3 font-bold text-sm">{errores.email}</span>}
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              id="password" type="password" name="password" required onChange={cambiado}
            />
          </div>
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
            className="w-full bg-indigo-600 text-white py-2 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Registrarse
          </button>
        </form>
        <div className="space-y-2">
          <button
            variant="outline"
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-md shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <ChromeIcon className="mr-2 h-4 w-4" />
            Registrarse con Google
          </button>
          <button
            variant="outline"
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-md shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <FacebookIcon className="mr-2 h-4 w-4" />
            Registrarse con Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

function ChromeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}
function FacebookIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
