import React from 'react';
import { FaUser } from "react-icons/fa";

export const PerfilImagen = ({ image, previewImage }) => {
  return (
    <div className="image-preview mb-4">
      {previewImage ? (
        <img src={previewImage} alt="Vista previa" className="w-52 h-52 rounded-full border m-auto border-gray-300 shadow-sm" />
      ) : image ? (
        <img src={image} alt="Perfil" className="w-52 h-52 rounded-full border m-auto border-gray-300 shadow-sm" />
      ) : (
        <FaUser className="w-52 h-52 rounded-full border m-auto border-gray-300 shadow-sm text-gray-400" />
      )}
    </div>
  );
};
