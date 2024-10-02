import React, { useEffect, useState } from 'react';
import { Peticion } from '../../helpers/Peticion';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { FaEdit } from "react-icons/fa";
import { Navigate } from 'react-router-dom';

export const Perfil = () => {

  const { auth } = useAuth()
  const [usuario, setUsuario] = useState(auth)
  const { setAuth } = useAuth();
  const [mensajeError, setMensajeError] = useState(null);
  const [edit, setEdit] = useState(false);
  const { formulario, cambiado } = useForm();

  const handleToggelEdit = () => {
    setEdit(!edit)
  }

  useEffect(() => {
    const usuariocompleto = async () => {
      const { datos } = await Peticion(Global.url + "user/completeProfile", "GET", null, false, 'include');
      if (datos) {
        setUsuario(datos.user)
      }
    }
    usuariocompleto();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { datos } = await Peticion(Global.url + "user/editUser", "POST", formulario, false, 'include');

    if (datos.status === "success") {
      setAuth(datos.user);
      setUsuario(datos.user)
      setEdit(!edit);
    } else {
      setMensajeError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    }
  };


  return (
    <div className=" mx-auto p-6 bg-white shadow-md rounded-lg mt-10 max-w-xl">
      <h2 className="text-xl font-bold text-center mb-4">Editar Perfil</h2>
      {mensajeError && <span>{mensajeError}</span>}
      <img src={auth.image} alt="" />
      {edit ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input type="text" name="name" defaultValue={usuario.name} onChange={cambiado}
              className="w-full p-2 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="w-full p-2">{usuario.email}</label>
          </div>
          <div>
            <input
              type="text"
              name="phone"
              defaultValue={usuario.phone}
              onChange={cambiado}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <input
              type="text"
              name="address"
              defaultValue={usuario.address}
              onChange={cambiado}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          {edit && (
            <button type="submit" className="w-full bg-lime-600 text-white py-2 rounded-md shadow-md hover:bg-lime-700">
              Guardar Cambios
            </button>
          )}

        </form>
      ) : (
        <div className="space-y-4 flex flex-col">
          <label className="w-full p-2 border border-gray-300 rounded-md">{usuario.name}</label>
          <label className="w-full p-2 border border-gray-300 rounded-md">{usuario.email}</label>
          <label className="w-full p-2 border border-gray-300 rounded-md">{usuario.phone}</label>
          <label className="w-full p-2 border border-gray-300 rounded-md">{usuario.address}</label>
        </div>
      )}
      <button onClick={handleToggelEdit} className='flex items-center'> <FaEdit className='mr-1' />Editar</button>
    </div>
  );
};