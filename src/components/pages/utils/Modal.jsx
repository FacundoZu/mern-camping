import React from 'react';

const Modal = ({ isOpen, onClose, title, message, onConfirm, showConfirmButton = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full z-50">
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">{title}</h2>
        <div className="mb-6" dangerouslySetInnerHTML={{ __html: message }}></div>
        <div className="flex justify-between">
          {showConfirmButton && (
            <button
              onClick={onConfirm}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Confirmar Reserva
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-lime-600 text-white py-2 px-6 rounded-md hover:bg-lime-700 transition duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
