import React, { useState, useEffect } from 'react';

const ReservaInfo = ({
  isOpen,
  onClose,
  fechaInicio,
  fechaFinal,
  total,
  metodoPago,
  setMetodoPago,
  tarjeta,
  setTarjeta,
  cuotas,
  setCuotas,
  comprobante,
  setComprobante,
  onConfirm
}) => {
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validarFormulario = () => {
      if (!metodoPago) return setIsFormValid(false);

      if (metodoPago === 'transferencia') {
        if (!comprobante) return setIsFormValid(false);
      } else if (metodoPago === 'tarjeta_debito' || metodoPago === 'tarjeta_credito') {
        if (!tarjeta.numero || !tarjeta.vencimiento || !tarjeta.cvv) return setIsFormValid(false);
        if (metodoPago === 'tarjeta_credito' && !cuotas) return setIsFormValid(false);
      }

      setIsFormValid(true);
    };

    validarFormulario();
  }, [metodoPago, tarjeta, cuotas, comprobante]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">¡Estás a punto de reservar!</h2>
        <p className="text-lg text-gray-800 mb-4 text-center">
          <strong>Detalles de la reserva:</strong>
        </p>
        <div className="text-sm text-gray-700 mb-4 space-y-2">
          <div>
            <strong>Fecha de inicio:</strong> {new Date(fechaInicio).toLocaleDateString('es-ES')}
          </div>
          <div>
            <strong>Fecha de fin:</strong> {new Date(fechaFinal).toLocaleDateString('es-ES')}
          </div>
          <div>
            <strong>Precio total:</strong> {total} €
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            <strong>Selecciona un método de pago:</strong>
          </label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
          >
            <option value="">Seleccionar...</option>
            <option value="transferencia">Transferencia Bancaria</option>
            <option value="tarjeta_debito">Débito</option>
            <option value="tarjeta_credito">Crédito</option>
          </select>

          {metodoPago === 'transferencia' && (
            <div className="mt-4">
              <p className="text-gray-800">
                <strong>CBU para Transferencia:</strong> 123456789012345678901234
              </p>
              <input
                type="file"
                onChange={(e) => setComprobante(e.target.files[0])}
                className="mt-2 block w-full text-gray-600"
                required
              />
              <p className="text-sm text-gray-500">Sube el comprobante de la transferencia</p>
            </div>
          )}

          {(metodoPago === 'tarjeta_debito' || metodoPago === 'tarjeta_credito') && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-gray-700">
                  <strong>Número de tarjeta:</strong>
                </label>
                <input
                  type="text"
                  value={tarjeta.numero}
                  onChange={(e) => setTarjeta({ ...tarjeta, numero: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                  placeholder="XXXX XXXX XXXX XXXX"
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  <strong>Vencimiento:</strong>
                </label>
                <input
                  type="month"
                  value={tarjeta.vencimiento}
                  onChange={(e) => setTarjeta({ ...tarjeta, vencimiento: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                  placeholder="MM/AA"
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  <strong>CVV:</strong>
                </label>
                <input
                  type="text"
                  value={tarjeta.cvv}
                  onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                  placeholder="XXX"
                />
              </div>
              {metodoPago === 'tarjeta_credito' && (
                <div className="mt-4">
                  <label className="block text-gray-700">
                    <strong>Cuotas:</strong>
                  </label>
                  <select
                    value={cuotas}
                    onChange={(e) => setCuotas(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                  >
                    <option value={1}>1 cuota</option>
                    <option value={3}>3 cuotas</option>
                    <option value={6}>6 cuotas</option>
                    <option value={12}>12 cuotas</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <button
            onClick={onConfirm}
            disabled={!isFormValid}
            className={`w-full mt-6 py-2 rounded-md transition duration-200 ${isFormValid ? 'bg-lime-600 text-white hover:bg-lime-700' : 'bg-gray-400 text-white cursor-not-allowed'}`}
          >
            Confirmar Reserva
          </button>
          <button
            onClick={onClose}
            className="w-full mt-3 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservaInfo;
