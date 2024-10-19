import React from 'react';

import { Peticion } from '../../../helpers/Peticion';
import { Global } from '../../../helpers/Global';
import { useNavigate } from 'react-router-dom';
import { useErrorHandling } from '../../../hooks/useErrorHandling';
import useAuth from '../../../hooks/useAuth';
import { useForm } from '../../../hooks/useForm';

export const Register = () => {
  const navigate = useNavigate();
  const { formulario, cambiado } = useForm({});
  const { setAuth } = useAuth();
  const { errores, mensajeError, manejarErrores, establecerMensajeError } = useErrorHandling();

  const guardarUsuario = async (e) => {
    e.preventDefault();
    establecerMensajeError(null);

    if (manejarErrores(formulario)) {
      const nuevoUsuario = formulario;
      const { datos } = await Peticion(Global.url + "user/register", "POST", nuevoUsuario, false, 'include');

      if (datos.status === "success") {
        setAuth(datos.user);
        navigate('/');
      } else if (datos.status === "error" && datos.message === "El usuario ya existe") {
        establecerMensajeError("El usuario ya está registrado. Por favor, intenta con otro email.");
      } else {
        establecerMensajeError("Error al registrar el usuario. Inténtalo de nuevo más tarde.");
      }
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 p-6 bg-white shadow-md rounded-lg mt-28">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Registro</h1>
        <p className="text-gray-500">Ingresa tu información para crear una cuenta</p>
      </div>
      <div className="">
        <form className='' onSubmit={guardarUsuario}>
          {/* Nombre */}
          <div className="flex flex-col gap-3 my-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mt-1">Nombre</label>
            <input className="form-input"
              id="name" type="text" name="name" placeholder="Tu nombre" required onChange={cambiado}
            />
            {errores.name && <span className="error-msg">{errores.name}</span>}
          </div>

          {/* Dirección */}
          <div className="flex flex-col gap-3 my-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
            <input className="form-input"
              id="address" type="text" name="address" placeholder="Tu dirección" required onChange={cambiado}
            />
            {errores.address && <span className="error-msg">{errores.address}</span>}
          </div>

          {/* Teléfono */}
          <div className="flex flex-col gap-3 my-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input className="form-input"
              id="phone" type="text" name="phone" placeholder="Tu teléfono" required onChange={cambiado}
            />
            {errores.phone && <span className="error-msg">{errores.phone}</span>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-3 my-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input className="form-input"
              id="email" type="email" name="email" placeholder="ejemplo@dominio.com" required onChange={cambiado}
            />
            {errores.email && <span className="error-msg">{errores.email}</span>}
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-3 my-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input className="form-input"
              id="password" type="password" name="password" required onChange={cambiado}
            />
            {errores.password && <span className="error-msg">{errores.password}</span>}
          </div>

          {/* Confirmar contraseña */}
          <div className="flex flex-col gap-3 my-2">
            <label htmlFor="password2" className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
            <input className="form-input"
              id="password2" type="password" name="password2" required onChange={cambiado}
            />
            {errores.password2 && <span className="error-msg">{errores.password2}</span>}
          </div>

          {mensajeError && <div className="error-msg">{mensajeError}</div>} {/* Mostrar mensaje de error */}

          <button
            type="submit"
            className="mt-4 botton-submit"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};