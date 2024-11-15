import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Peticion } from '../../../helpers/Peticion';
import { Global } from '../../../helpers/Global';

import { PiUsersThreeFill, PiToiletBold } from "react-icons/pi";
import { MdOutlineBedroomChild } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";

import { CalendarioReservas } from './utils/CalendarioReservas';
import { CabañaSwiper } from './utils/CabañaSwiper.jsx';
import { CalendarioModal } from './utils/CalendarioModal.jsx';
import useAuth from '../../../hooks/useAuth';
import Modal from '../utils/Modal.jsx';

export const Cabaña = () => {
    const { id } = useParams();
    const [cabaña, setCabaña] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [reservas, setReservas] = useState([]);
    const [mensajeError, setMensajeError] = useState(null);
    const { auth } = useAuth();

    const [isCalModalOpen, setIsCalModalOpen] = useState(false);

    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [precioTotal, setPrecioTotal] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [metodoPago, setMetodoPago] = useState('');
    const [cbu, setCbu] = useState('');
    const [comprobante, setComprobante] = useState(null);
    const [tarjeta, setTarjeta] = useState({
        numero: '',
        vencimiento: '',
        cvv: '',
    });
    const [cuotas, setCuotas] = useState(1);
    useEffect(() => {
        const obtenerCabañaYReservas = async () => {
            const urlCabania = `${Global.url}cabin/getCabin/${id}`;
            const { datos: datosCabania } = await Peticion(urlCabania, "GET", null, false, 'include');

            if (datosCabania) {
                setCabaña(datosCabania.cabin);
                setCargando(false);

                const urlReservas = `${Global.url}reservation/getReservations/${id}`;
                const { datos } = await Peticion(urlReservas, "GET", null, false, 'include');
                if (datos) {
                    setReservas(datos.reservas);
                }
            }
        };

        obtenerCabañaYReservas();
    }, [id]);

    const calcularPrecioTotal = (fechaInicio, fechaFinal) => {
        const diasDeEstancia = (new Date(fechaFinal) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24);
        return diasDeEstancia * cabaña.precio;
    };

    const handleReservar = (fechas) => {
        setFechaInicio(fechas.fechaInicio);
        setFechaFin(fechas.fechaFinal);
        const total = calcularPrecioTotal(fechas.fechaInicio, fechas.fechaFinal);
        setPrecioTotal(total);

        setIsConfirming(true);
        setModalTitle('Confirmar Reserva');
        setModalMessage(`
            <div class="text-center p-6 bg-gray-100 rounded-lg border-2 border-dashed border-green-400 max-w-md mx-auto">
                <h2 class="text-2xl font-bold text-green-600 mb-4">¡Estás a punto de reservar!</h2>
                <p class="text-lg text-gray-800 mb-4"><strong>Detalles de la reserva:</strong></p>
                <div class="text-sm text-gray-700 mb-4">
                    <div><strong>Fecha de inicio:</strong> ${new Date(fechas.fechaInicio).toLocaleDateString('es-ES')}</div>
                    <div><strong>Fecha de fin:</strong> ${new Date(fechas.fechaFinal).toLocaleDateString('es-ES')}</div>
                    <div><strong>Precio total:</strong> ${total} €</div>
                </div>
                <div>
                    <label class="block text-gray-700"><strong>Selecciona un método de pago:</strong></label>
                    <select
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Seleccionar...</option>
                        <option value="transferencia">Transferencia Bancaria</option>
                        <option value="debito">Débito</option>
                        <option value="credito">Crédito</option>
                    </select>
    
                    {metodoPago === 'transferencia' && (
                        <div className="mt-4">
                            <p><strong>CBU para Transferencia:</strong> 123456789012345678901234</p>
                            <input
                                type="file"
                                onChange={(e) => setComprobante(e.target.files[0])}
                                className="mt-2"
                            />
                            <p className="text-sm text-gray-500">Sube el comprobante de la transferencia</p>
                        </div>
                    )}
    
                    {(metodoPago === 'debito' || metodoPago === 'credito') && (
                        <div className="mt-4">
                            <div>
                                <label class="block text-gray-700"><strong>Número de tarjeta:</strong></label>
                                <input
                                    type="text"
                                    value={tarjeta.numero}
                                    onChange={(e) => setTarjeta({ ...tarjeta, numero: e.target.value })}
                                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                                    placeholder="XXXX XXXX XXXX XXXX"
                                />
                            </div>
                            <div>
                                <label class="block text-gray-700"><strong>Vencimiento:</strong></label>
                                <input
                                    type="text"
                                    value={tarjeta.vencimiento}
                                    onChange={(e) => setTarjeta({ ...tarjeta, vencimiento: e.target.value })}
                                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                                    placeholder="MM/AA"
                                />
                            </div>
                            <div>
                                <label class="block text-gray-700"><strong>CVV:</strong></label>
                                <input
                                    type="text"
                                    value={tarjeta.cvv}
                                    onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value })}
                                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                                    placeholder="XXX"
                                />
                            </div>
                            {metodoPago === 'credito' && (
                                <div className="mt-4">
                                    <label class="block text-gray-700"><strong>Cuotas:</strong></label>
                                    <select
                                        value={cuotas}
                                        onChange={(e) => setCuotas(e.target.value)}
                                        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
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
                </div>
            </div>
        `);
        setIsModalOpen(true);
    };


    const handleConfirmReservation = async () => {
        const nuevaReserva = {
            usuarioId: auth.id,
            cabaniaId: cabaña._id,
            fechaInicio,
            fechaFinal: fechaFin,
            precioTotal,
            metodoPago,
            comprobante,
            tarjeta,
            cuotas,
        };

        const url = `${Global.url}reservation/createReservation`;

        try {
            const response = await Peticion(url, 'POST', nuevaReserva, false, 'include');

            if (response.datos?.status === 'success') {
                setMensajeError(null);
                setReservas((prevReservas) => (Array.isArray(prevReservas) ? [...prevReservas, nuevaReserva] : [nuevaReserva]));
                setModalTitle('Reserva Confirmada');
                setModalMessage(`
                    <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 8px; border: 2px dashed #65a30d; max-width: 400px; margin: 0 auto;">
                        <h2 style="font-size: 24px; color: #65a30d; font-weight: bold;">¡Reserva Confirmada!</h2>
                        <p style="font-size: 16px; color: #333; margin-bottom: 10px;">
                        <strong>¡Tu reserva ha sido completada con éxito!</strong>
                        </p>
                        <div style="font-size: 14px; color: #333; margin-bottom: 10px;">
                            <div><strong>Fecha de inicio:</strong> ${new Date(fechaInicio).toLocaleDateString('es-ES')}</div>
                            <div><strong>Fecha de fin:</strong> ${new Date(fechaFin).toLocaleDateString('es-ES')}</div>
                            <div><strong>Precio total:</strong> ${precioTotal} €</div>
                        </div>
                        <div style="padding: 10px 0; border-top: 2px solid #65a30d; margin-top: 20px;">
                            <span style="font-size: 14px; color: #65a30d;">Gracias por tu preferencia. ¡Nos vemos pronto!</span>
                        </div>
                    </div>
                `);
                setIsConfirming(false);
            } else if (response.datos?.mensaje) {
                setMensajeError(response.datos.mensaje);
            }
        } catch (error) {
            setMensajeError('Error al guardar la reserva, intenta nuevamente.');
            console.error(error);
        } finally {
            setIsModalOpen(true);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleShowCalendaro = () => {
        setIsCalModalOpen(true);
    };

    return (
        <div className="container mx-auto p-6 max-w-screen-xl">
            {cargando ? (
                <div className="text-center text-gray-500 text-xl py-8">Cargando información...</div>
            ) : cabaña ? (
                <section className="bg-white rounded-lg shadow-md overflow-hidden">
                    <CabañaSwiper cabaña={cabaña} />
                    <div className="p-4">

                        <h1 className="text-2xl font-semibold text-center text-lime-700 py-4 ">{cabaña.descripcion}</h1>
                        <hr className='mt-4' />
                        {cabaña.servicios && (
                            <div className="mt-6">
                                <div className="flex flex-wrap">
                                    {cabaña.servicios.length > 0 ? (
                                        cabaña.servicios.map((servicio) => (
                                            servicio.estado == 'Habilitado' &&
                                            <div key={servicio._id} className="grid grid-rows-3 gap-0 p-4 bg-white m-auto h-44 w-60">
                                                <img src={servicio.imagen} alt={servicio.nombre} className="w-12 h-12 mx-auto mb-2 object-cover" />
                                                <p className="text-base text-gray-700 font-medium text-center my-auto">
                                                    {servicio.nombre}
                                                </p>
                                                <p className="text-sm text-gray-400 font-medium text-center leading-snug mt-1">
                                                    {servicio.descripcion}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-500 col-span-full text-center">
                                            No hay servicios disponibles
                                        </div>
                                    )}
                                </div>

                                <div className='flex gap-4 mt-4 mx-10'>
                                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg w-full p-3 md:w-1/3 border border-lime-300">
                                        <PiUsersThreeFill className="text-2xl text-lime-600" />
                                        <p className="text-gray-700">{cabaña.cantidadPersonas}</p>
                                        <p className="text-gray-700">Personas</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 w-full md:w-1/3 border border-lime-300">
                                        <MdOutlineBedroomChild className="text-2xl text-lime-600" />
                                        <p className="text-gray-700">{cabaña.cantidadHabitaciones}</p>
                                        <p className="text-gray-700">Habitaciones</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 w-full md:w-1/3 border border-lime-300">
                                        <PiToiletBold className="text-2xl text-lime-600" />
                                        <p className="text-gray-700">{cabaña.cantidadBaños}</p>
                                        <p className="text-gray-700">Baños</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <hr className='pt-4 mt-8' />
                        <div className="min-h-screen  items-center justify-center bg-gray-100 hidden sm:inline">
                            <CalendarioReservas reservas={reservas} onReservar={handleReservar} mensajeError={mensajeError} />
                        </div>
                        <div className='sm:hidden mt-4'>
                            <button onClick={handleShowCalendaro} className='flex items-center m-auto bg-lime-400 hover:bg-lime-600 p-3 rounded-lg text-center'>
                                <FaCalendarAlt className='mr-2' />
                                Ver calendario de reservas
                            </button>
                            <CalendarioModal isOpen={isCalModalOpen} onClose={() => setIsCalModalOpen(false)} reservas={reservas} onReservar={handleReservar} mensajeError={mensajeError} />
                        </div>
                    </div>
                </section>
            ) : (
                <div className="text-center text-gray-500">No se encontró la cabaña.</div>
            )}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCancel}
                title={modalTitle}
                message={modalMessage}
                onConfirm={handleConfirmReservation}
                showConfirmButton={isConfirming}
            />
        </div>
    );
};
