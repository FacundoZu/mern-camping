import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

const ReservaInfo = ({
  isOpen,
  onClose,
  fechaInicio,
  fechaFinal,
  precioTotal,
  precioPorDia,
  metodoPago,
  setMetodoPago,
  tarjeta,
  setTarjeta,
  cuotas,
  setCuotas,
  comprobante,
  setComprobante,
  onConfirm,
  isGuest,
  guestInfo,
  onGuestInfoChange
}) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const { auth } = useAuth()

  const calcularCantidadDeDias = () => {
    return ((new Date(fechaFinal) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24) + 1);
  };

  const cantidadDeDias = calcularCantidadDeDias();

  useEffect(() => {
    const validarFormulario = () => {
      if (auth) {
        return setIsFormValid(true)
      }
      if (isGuest && activeStep === 1) {
        if (!guestInfo.nombre || !guestInfo.email || !guestInfo.telefono) {
          return setIsFormValid(false);
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
          return setIsFormValid(false);
        }
        return setIsFormValid(true);
      }

      if (!metodoPago) return setIsFormValid(false);

      if (metodoPago === 'transferencia') {
        if (!comprobante) return setIsFormValid(false);
      } else if (metodoPago === 'tarjeta_debito' || metodoPago === 'tarjeta_credito') {
        if (!tarjeta?.numero || !tarjeta?.vencimiento || !tarjeta?.cvv) return setIsFormValid(false);
        if (metodoPago === 'tarjeta_credito' && !cuotas) return setIsFormValid(false);
      }

      setIsFormValid(true);
    };

    validarFormulario();
  }, [metodoPago, tarjeta, cuotas, comprobante, isGuest, guestInfo, activeStep]);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (isFormValid) {
      setActiveStep(2);
      setPaymentDetails({
        dias: cantidadDeDias,
        precioNoche: precioPorDia,
        total: precioTotal
      });
    }
  };

  const handlePrevStep = () => {
    setActiveStep(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto py-8">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${activeStep === 1 ? 'text-green-600' : 'text-gray-500'}`}>
              {isGuest ? 'Datos personales' : 'Resumen'}
            </span>
            <span className={`text-sm font-medium ${activeStep === 2 ? 'text-green-600' : 'text-gray-500'}`}>
              Método de pago
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${activeStep === 1 ? '50%' : '100%'}` }}
            ></div>
          </div>
        </div>

        {/* Paso 1: Información del huésped o resumen */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              {isGuest ? 'Completa tus datos' : 'Resumen de tu reserva'}
            </h2>

            {isGuest ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Nombre completo</label>
                  <input
                    type="text"
                    name="nombre"
                    value={guestInfo.nombre}
                    onChange={onGuestInfoChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={guestInfo.email}
                    onChange={onGuestInfoChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    placeholder="ejemplo@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={guestInfo.telefono}
                    onChange={onGuestInfoChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    placeholder="+54 9 11 1234-5678"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Al continuar, aceptas nuestros <a href="#" className="text-green-600 hover:underline">Términos y condiciones</a>.
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800">Detalles de la estadía</h3>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {cantidadDeDias} {cantidadDeDias === 1 ? 'noche' : 'noches'}
                  </span>
                </div>
                
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span className="font-medium">{new Date(fechaInicio).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span className="font-medium">{new Date(fechaFinal).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between">
                    <span>Precio por noche:</span>
                    <span>${precioPorDia.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-2">
                    <span>Total:</span>
                    <span className="text-green-600">${precioTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleNextStep}
              disabled={!isFormValid}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${isFormValid ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Continuar al pago
            </button>
          </div>
        )}

        {/* Paso 2: Método de pago */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Método de pago</h2>
            
            {/* Resumen de pago */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Resumen de pago</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>{paymentDetails?.dias} {paymentDetails?.dias === 1 ? 'noche' : 'noches'}:</span>
                  <span>${(paymentDetails?.precioNoche * paymentDetails?.dias).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-base mt-2">
                  <span>Total:</span>
                  <span className="text-green-600">${paymentDetails?.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Selección de método de pago */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Selecciona tu método de pago</label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setMetodoPago('transferencia')}
                  className={`p-3 border rounded-lg flex flex-col items-center transition-all ${metodoPago === 'transferencia' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className="text-xs mt-1">Transferencia</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMetodoPago('tarjeta_debito')}
                  className={`p-3 border rounded-lg flex flex-col items-center transition-all ${metodoPago === 'tarjeta_debito' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-xs mt-1">Débito</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMetodoPago('tarjeta_credito')}
                  className={`p-3 border rounded-lg flex flex-col items-center transition-all ${metodoPago === 'tarjeta_credito' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-xs mt-1">Crédito</span>
                </button>
              </div>

              {/* Detalles del método de pago seleccionado */}
              {metodoPago === 'transferencia' && (
                <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Datos para transferencia</h4>
                    <div className="bg-white p-3 rounded-md border border-gray-200">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Banco:</span>
                        <span className="font-medium">Banco Ejemplo</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">CBU:</span>
                        <span className="font-medium">1234567890123456789012</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Titular:</span>
                        <span className="font-medium">Cabañas del Lago S.A.</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Subir comprobante</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col w-full border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg cursor-pointer transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-gray-500 mt-2">
                            {comprobante ? comprobante.name : 'Haz clic para subir tu comprobante'}
                          </p>
                        </div>
                        <input 
                          type="file" 
                          onChange={(e) => setComprobante(e.target.files[0])} 
                          className="hidden" 
                          accept="image/*,.pdf"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {(metodoPago === 'tarjeta_debito' || metodoPago === 'tarjeta_credito') && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Número de tarjeta</label>
                    <input
                      type="text"
                      value={tarjeta?.numero || ''}
                      onChange={(e) => setTarjeta({ ...tarjeta, numero: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Vencimiento</label>
                      <input
                        type="text"
                        value={tarjeta?.vencimiento || ''}
                        onChange={(e) => setTarjeta({ ...tarjeta, vencimiento: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                        placeholder="MM/AA"
                        maxLength="5"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">CVV</label>
                      <input
                        type="text"
                        value={tarjeta?.cvv || ''}
                        onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                        placeholder="123"
                        maxLength="3"
                      />
                    </div>
                  </div>
                  {metodoPago === 'tarjeta_credito' && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Cuotas</label>
                      <select
                        value={cuotas}
                        onChange={(e) => setCuotas(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      >
                        <option value="">Selecciona cuotas</option>
                        <option value="1">1 cuota (sin interés)</option>
                        <option value="3">3 cuotas</option>
                        <option value="6">6 cuotas</option>
                        <option value="12">12 cuotas</option>
                      </select>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Tus datos están protegidos con encriptación SSL
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handlePrevStep}
                className="py-3 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Atrás
              </button>
              <button
                onClick={onConfirm}
                disabled={!isFormValid}
                className={`py-3 rounded-lg font-medium transition-colors ${isFormValid ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                Confirmar reserva
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservaInfo;