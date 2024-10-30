import React, { useEffect, useState } from 'react';
import { Peticion } from '../../helpers/Peticion';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { FaEdit } from "react-icons/fa";

export const Perfil = () => {

  const { auth, setAuth } = useAuth()
  const [usuario, setUsuario] = useState(auth)
  const { formulario, cambiado } = useForm();

  const [mensajeError, setMensajeError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [edit, setEdit] = useState(false);


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

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const imageURL = URL.createObjectURL(file);
      setPreviewImage(imageURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', selectedFile);

    const response = await fetch("http://localhost:3900/api/user/subir-imagen", {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      }
    });

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
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Vista previa" className="w-48 h-48 object-cover" />
            </div>
          )}
          <input
            type="file"
            id="fileInput"
            name="image"
            onChange={onFileChange} // Maneja la selección del archivo
            className="mt-2 p-2 border border-gray-300 rounded-md shadow-sm"
            accept="image/*" // Limita la selección a imágenes
          />
          <div>
            <input type="text" name="name" defaultValue={usuario.name} onChange={cambiado}
              className="form-input" required />
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
              className="form-input"
            />
          </div>
          <div>
            <input
              type="text"
              name="address"
              defaultValue={usuario.address}
              onChange={cambiado}
              className="form-input"
            />
          </div>
          {edit && (
            <button type="submit" className="botton-submit">
              Guardar Cambios
            </button>
          )}

        </form>
      ) : (
        <div className="space-y-4 flex flex-col">
          {
          }
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