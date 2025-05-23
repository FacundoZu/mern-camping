import React, {  useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Peticion } from '../../../helpers/Peticion';
import { Global } from '../../../helpers/Global';
import { useForm } from '../../../hooks/useForm';
import useAuth from '../../../hooks/useAuth';
import { FcGoogle } from "react-icons/fc";

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
    <div className="mx-auto max-w-md space-y-6 p-6 bg-white shadow-md rounded-lg mt-16">
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
              className="form-input"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input id="password" type="password" name="password" onChange={cambiado} required
              className="form-input"
            />
          </div>

          {mensajeError && <div className="error-msg">{mensajeError}</div>}

          <button type="submit" className="botton-submit mt-4">
            Iniciar sesión
          </button>
        </form>

        <div className="text-center">
          <h2>¿No tienes una cuenta?</h2>
          <Link to='/register' className="text-lime-600 underline">Crea una cuenta</Link>
        </div>

        <div className="space-y-2">
          <button onClick={googleLogin} className="flex w-full text-balance gap-2 items-center justify-center">
            <FcGoogle />
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    </div>
  );
};
