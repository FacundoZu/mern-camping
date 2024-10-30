import React from 'react';

const Modal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full z-50">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="text-right">
          <button onClick={onClose} className="bg-lime-500 text-white py-2 px-4 rounded hover:bg-lime-600">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
