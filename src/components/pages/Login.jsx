import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Peticion } from '../../helpers/Peticion';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';

export const Login = () => {
  const navigate = useNavigate();
  const { formulario, cambiado } = useForm({});
  const [mensajeError, setMensajeError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError(null); // Limpiar mensajes previos

    // Realizar la petición para iniciar sesión
    console.log(formulario)
    const { datos } = await Peticion(Global.url + "user/login", "POST", formulario, false, 'include');

    if (datos.status === "success") {
      // Redirigir al home
      navigate('/');
    } else {
      setMensajeError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 p-6 bg-white shadow-md rounded-lg mt-28">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Iniciar sesión</h1>
        <p className="text-gray-500">
          Ingresa tu correo electrónico a continuación para iniciar sesión en tu cuenta.
        </p>
      </div>

      <div className="space-y-4">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input id="email" type="email" name="email" placeholder="ejemplo@dominio.com" onChange={cambiado} required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input id="password" type="password" name="password" onChange={cambiado} required
              className="w-full p-2 border rounded"
            />
          </div>

          {mensajeError && <div className="text-red-500 bg-red-600 bg-opacity-10 rounded-lg p-2 mt-3 font-bold text-sm">{mensajeError}</div>}

          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded mt-4 hover:bg-indigo-700">
            Iniciar sesión
          </button>
        </form>

        <div className="text-center">
          <h2>¿No tienes una cuenta?</h2>
          <Link to='/register' className="text-blue-500 underline">Crea una cuenta</Link>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button className="w-full border border-gray-300 py-2 rounded hover:bg-gray-100">
            <ChromeIcon className="mr-2 h-4 w-4" />
            Google
          </button>
          <button className="w-full border border-gray-300 py-2 rounded hover:bg-gray-100">
            <FacebookIcon className="mr-2 h-4 w-4" />
            Facebook
          </button>
        </div>

        <a href="#" className="inline-block w-full text-center text-sm underline mt-2">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </div>
  );
};

function ChromeIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

