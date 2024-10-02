import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Peticion } from '../../helpers/Peticion';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';
import { AuthContext } from '../../context/AuthContext';
import useAuth from '../../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const { formulario, cambiado } = useForm({});
  const [mensajeError, setMensajeError] = useState(null);
  const { setAuth } = useAuth();

  const googleLogin = () => {
    window.open("http://localhost:3900/api/user/google", "_self");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError(null); 

    const { datos } = await Peticion(Global.url + "user/login", "POST", formulario, false, 'include');

    if (datos.status === "success") {
      setAuth(datos.user);
      navigate('/home');
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

          <button type="submit" className="w-full bg-lime-600 text-white py-2 rounded mt-4 hover:bg-lime-700">
            Iniciar sesión
          </button>
        </form>

        <div className="text-center">
          <h2>¿No tienes una cuenta?</h2>
          <Link to='/register' className="text-lime-600 underline">Crea una cuenta</Link>
        </div>

        <div className="space-y-2">
          <button onClick={googleLogin}>
            Iniciar sesión con Google
          </button>
        </div>

        <a href="#" className="inline-block w-full text-center text-sm underline mt-2">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </div>
  );
};
