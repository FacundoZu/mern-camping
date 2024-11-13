import React from 'react';

const Modal = ({ isOpen, onClose, title, message, onConfirm, showConfirmButton = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full z-50">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="mb-4" dangerouslySetInnerHTML={{ __html: message }}></div>
        <div className="text-right">
          {showConfirmButton && (
            <button
              onClick={onConfirm}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
            >
              Confirmar Reserva
            </button>
          )}
          <button onClick={onClose} className="bg-lime-500 text-white py-2 px-4 rounded hover:bg-lime-600">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
