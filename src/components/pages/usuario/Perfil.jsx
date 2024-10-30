import React, { useEffect, useState } from 'react';
import { Global } from '../../../helpers/Global';
import useAuth from '../../../hooks/useAuth';
import { FaEdit } from "react-icons/fa";
import { Peticion } from '../../../helpers/Peticion';
import { PerfilImagen } from './Utils/PerfilImagen';
import { Loading } from './Utils/Loading';
import { EditarPerfil } from './Utils/EditarPerfilForm';
import { Detalleperfil } from './Utils/DetallePerfil';

export const Perfil = () => {
  const { auth, setAuth } = useAuth();
  const [usuario, setUsuario] = useState(auth);
  const [mensajeError, setMensajeError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggelEdit = () => {
    setEdit(!edit);
    setPreviewImage(null)
  };

  useEffect(() => {
    const obtenerUsuarioCompleto = async () => {
      const { datos } = await Peticion(Global.url + "user/completeProfile", "GET", null, false, 'include');
      if (datos) {
        setUsuario(datos.user);
      }
    };
    obtenerUsuarioCompleto();
  }, []);

  const handleSubmit = async (formulario) => {
    setLoading(true);
    setMensajeError(null);
    const formData = new FormData();
    formData.append('image', selectedFile);

    const respuestaImagen = await Peticion(Global.url + 'user/uploadImage', 'POST', formData, true, 'include');
    const { datos } = await Peticion(Global.url + "user/editUser", "POST", formulario, false, 'include');

    if (datos.status === "success") {
      setAuth(datos.user);
      setUsuario(datos.user);
      setEdit(false);
    } else {
      setMensajeError("Hubo un error al actualizar el perfil. Por favor, inténtalo de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-lg mt-5 max-w-screen-md">
      <h2 className="text-xl font-bold text-center mb-4">Perfil de Usuario</h2>
      {mensajeError && <ErrorMensaje message={mensajeError} />}

      <PerfilImagen image={auth.image} previewImage={previewImage} />

      {loading ? (
        <Loading />
      ) : edit ? (
        <EditarPerfil
          usuario={usuario}
          setSelectedFile={setSelectedFile}
          setPreviewImage={setPreviewImage}
          handleSubmit={handleSubmit}
          handleToggelEdit={handleToggelEdit}
        />
      ) : (
        <Detalleperfil usuario={usuario} handleToggelEdit={handleToggelEdit} />
      )}

      <section className='mt-4'>
        <h3>Historial de Reservas</h3>
        <p>Continuará...</p>
      </section>
    </div>
  );
};
