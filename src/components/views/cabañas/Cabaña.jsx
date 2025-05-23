import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Peticion } from '../../../helpers/Peticion';
import { Global } from '../../../helpers/Global';

import { PiUsersThreeFill, PiToiletBold } from "react-icons/pi";
import { MdOutlineBedroomChild } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";

import { CalendarioReservas } from './../../utils/cabañas/CalendarioReservas.jsx';
import { CabañaSwiper } from './../../utils/cabañas/CabañaSwiper.jsx';
import { CalendarioModal } from './../../utils/cabañas/CalendarioModal.jsx';
import useAuth from '../../../hooks/useAuth';
import Modal from './../../utils/Modal.jsx';
import ReservaInfo from './../../utils/ReservaInfo.jsx';
import ComentariosList from './../../utils/cabañas/ComentariosList.jsx';

export const Cabaña = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    const [cabaña, setCabaña] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [reservas, setReservas] = useState([]);
    const [comentarios, setComentarios] = useState([]);
    const [mensajeError, setMensajeError] = useState(null);
    const { auth } = useAuth();

    const [isCalModalOpen, setIsCalModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [metodoPago, setMetodoPago] = useState('');
    const [cbu, setCbu] = useState('');
    const [comprobante, setComprobante] = useState('');
    const [tarjeta, setTarjeta] = useState('');
    const [cuotas, setCuotas] = useState('');
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFinal, setFechaFin] = useState(null);
    const [precioTotal, setPrecioTotal] = useState(0);
    const [isModalOpenR, setIsModalOpenR] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [guestInfo, setGuestInfo] = useState({
        nombre: '',
        email: '',
        telefono: ''
    });

    const obtenerCabañaYReservas = async () => {
        if (!id) {
            setMensajeError("ID de cabaña no válido.");
            setCargando(false);
            return;
        }

        try {
            const urlCabania = `${Global.url}cabin/getCabin/${id}`;
            const { datos: datosCabania } = await Peticion(urlCabania, "GET", "", false, 'include');

            if (!datosCabania || !datosCabania.cabin) {
                setMensajeError("No se encontró la cabaña.");
                setCargando(false);
                return;
            }

            setCabaña(datosCabania.cabin);

            const urlReservas = `${Global.url}reservation/getReservations/${id}`;
            const { datos: datosReservas } = await Peticion(urlReservas, "GET", null, false, 'include');

            if (datosReservas && datosReservas.reservas) {
                setReservas(datosReservas.reservas);
            }

            const urlComentarios = `${Global.url}reviews/getReviewsByCabin/${id}`;
            const { datos: datosComentarios } = await Peticion(urlComentarios, "GET", null, false, null);

            if (datosComentarios && datosComentarios.reviews) {
                setComentarios(datosComentarios.reviews);
            }
        } catch (error) {
            setMensajeError("Error al cargar los datos de la cabaña.");
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerCabañaYReservas();
    }, [id]);

    useEffect(() => {
        let timer;

        const startTime = Date.now();

        const registerVisit = async () => {
            const timeSpent = Date.now() - startTime;
            if (timeSpent >= 5000) {
                const url = `${Global.url}user/registerVisit`;
                await Peticion(url, "POST", {
                    userId: auth?.id || null,
                    cabinId: id
                }, false, 'include');
            }
        }
        timer = setTimeout(registerVisit, 5000);

        return () => clearTimeout(timer);
    }, [id, auth])

    const calcularPrecioTotal = (fechaInicio, fechaFinal) => {
        const diasDeEstancia = (new Date(fechaFinal) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24) + 1;
        return diasDeEstancia * cabaña.precio;
    };

    const handleReservar = (fechas) => {
        setFechaInicio(fechas.fechaInicio);
        setFechaFin(fechas.fechaFinal);
        const total = calcularPrecioTotal(fechas.fechaInicio, fechas.fechaFinal);
        setPrecioTotal(total);

        if (mensajeError == null) {
            setIsModalOpenR(true);
        }
    };

    const handleGuestInfoChange = (e) => {
        const { name, value } = e.target;
        setGuestInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateGuestInfo = () => {

        if (!guestInfo.nombre.trim()) {
            setModalTitle('Error');
            setModalMessage('Por favor ingresa tu nombre completo.');
            setIsModalOpen(true);
            return false;
        }

        if (!guestInfo.email.trim()) {
            setModalTitle('Error');
            setModalMessage('Por favor ingresa tu email.');
            setIsModalOpen(true);
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
            setModalTitle('Error');
            setModalMessage('Por favor ingresa un email válido.');
            setIsModalOpen(true);
            return false;
        }

        if (!guestInfo.telefono.trim()) {
            setModalTitle('Error');
            setModalMessage('Por favor ingresa tu número de teléfono.');
            setIsModalOpen(true);
            return false;
        }

        return true;
    };

    const handleConfirmReservation = async () => {
        if (!auth && !validateGuestInfo()) {
            return;
        }

        const payment = {
            tipo: metodoPago,
            estadoPago: 'pendiente',
            transaccionId: metodoPago === 'transferencia' ? comprobante?.name : null,
            cuotas: metodoPago === 'tarjeta_credito' ? cuotas : null,
        };

        const nuevaReserva = {
            usuarioId: auth?.id || null,
            cabaniaId: cabaña._id,
            fechaInicio,
            fechaFinal,
            precioTotal,
            metodoPago,
            cabaña: {
                nombre: cabaña.nombre,
                cantidadPersonas: cabaña.cantidadPersonas,
                cantidadHabitaciones: cabaña.cantidadHabitaciones,
                cantidadBaños: cabaña.cantidadBaños,
            },
            guestInfo: auth ? null : guestInfo,
            payment,
        };

        const url = `${Global.url}reservation/createReservation`;
        try {
            const response = await Peticion(url, 'POST', nuevaReserva, false);
            console.log(response)
            if (response.datos?.status === 'success') {
                setMensajeError(null);

                setReservas((prevReservas) =>
                    Array.isArray(prevReservas) ? [...prevReservas, nuevaReserva] : [nuevaReserva]
                );

                setModalTitle('Reserva Confirmada');
                setModalMessage(`
                    <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 8px; border: 2px dashed #65a30d; max-width: 400px; margin: 0 auto;">
                        <h2 style="font-size: 24px; color: #65a30d; font-weight: bold;">¡Reserva Confirmada!</h2>
                        <p style="font-size: 16px; color: #333; margin-bottom: 10px;">
                            <strong>¡Tu reserva ha sido completada con éxito!</strong>
                        </p>
                        <div style="font-size: 14px; color: #333; margin-bottom: 10px;">
                            ${!auth ? `<div><strong>Nombre:</strong> ${guestInfo.nombre}</div>` : ''}
                            <div><strong>Fecha de inicio:</strong> ${new Date(fechaInicio).toLocaleDateString('es-ES')}</div>
                            <div><strong>Fecha de fin:</strong> ${new Date(fechaFinal).toLocaleDateString('es-ES')}</div>
                            <div><strong>Precio total:</strong> ${precioTotal} €</div>
                            <div><strong>Cabaña:</strong> ${cabaña.nombre}</div>
                        </div>
                        <div style="padding: 10px 0; border-top: 2px solid #65a30d; margin-top: 20px;">
                            <span style="font-size: 14px; color: #65a30d;">Gracias por tu preferencia. ¡Nos vemos pronto!</span>
                            <br />
                            <span style="font-size: 14px;"><strong>Te hemos enviado un correo con los detalles</strong></span>
                            ${!auth ? `<br /><span style="font-size: 12px; color: #666;">Guarda este número de referencia: ${response.datos.reserva._id}</span>` : ''}
                        </div>
                    </div>
                `);

                const correoUsuario = auth?.email || guestInfo.email;
                const detallesReserva = {
                    fechaInicio,
                    fechaFinal,
                    precioTotal,
                    metodoPago,
                    cabaña: {
                        nombre: cabaña.nombre,
                        cantidadPersonas: cabaña.cantidadPersonas,
                        cantidadHabitaciones: cabaña.cantidadHabitaciones,
                        cantidadBaños: cabaña.cantidadBaños,
                    },
                    guestInfo: auth ? null : guestInfo
                };

                await fetch(`${Global.url}enviarTicket`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        correoUsuario,
                        detallesReserva,
                    }),
                });

                setIsModalOpenR(false);
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

    const handleCancelR = () => {
        setIsModalOpenR(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleShowCalendaro = () => {
        setIsCalModalOpen(true);
    };

    const handleAddReview = async (rating, comment) => {
        if (!auth || !auth.id) {
            setModalTitle('Error');
            setModalMessage('Debes iniciar sesión para dejar un comentario.');
            setIsModalOpen(true);
            return;
        }

        try {
            const urlReservasUsuario = `${Global.url}reservation/getUserReservations/${auth.id}/${cabaña._id}`;
            const { datos } = await Peticion(urlReservasUsuario, "GET", null, false, "include");

            if (!datos || !datos.reservas || datos.reservas.length === 0) {
                setModalTitle('Error');
                setModalMessage('Solo los usuarios que hayan reservado esta cabaña pueden dejar un comentario.');
                setIsModalOpen(true);
                return;
            }

            const reservaPasada = datos.reservas.some((reserva) => {
                const fechaFinReserva = new Date(reserva.fechaFinal);
                return fechaFinReserva < new Date();
            });

            if (!reservaPasada) {
                setModalTitle('Error');
                setModalMessage('Solo puedes comentar una vez que tu reserva haya finalizado.');
                setIsModalOpen(true);
                return;
            }

            const review = {
                rating,
                comment,
                user: auth.id,
                cabin: cabaña._id,
            };

            const urlReview = `${Global.url}reviews/createReview`;
            const result = await Peticion(urlReview, "POST", review, false, "include");

            if (result.datos.success) {
                setComentarios((prevComentarios) => (prevComentarios ? [...prevComentarios, result.datos.review] : [result.datos.review]));
                setModalTitle('Éxito');
                setModalMessage('¡Gracias por dejar tu comentario!');
                setIsModalOpen(true);
            } else {
                setModalTitle('Error');
                setModalMessage('Hubo un problema al guardar tu comentario. Por favor, inténtalo de nuevo.');
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Error al intentar agregar la reseña:", error);
            setModalTitle('Error');
            setModalMessage('Ocurrió un error inesperado. Intenta nuevamente más tarde.');
            setIsModalOpen(true);
        }
    };

    const handleEditReview = async (reviewId, updatedData) => {
        if (!updatedData.rating || updatedData.comment.trim() === "") {
            return;
        }
        try {
            const urlReview = `${Global.url}reviews/updateReview/${reviewId}`;
            const result = await Peticion(urlReview, "POST", updatedData, false, "include");
            if (result.datos.success) {
                setComentarios((prevComentarios) =>
                    prevComentarios.map((review) =>
                        review._id === reviewId
                            ? {
                                ...review,
                                rating: updatedData.rating,
                                comments: [{ text: updatedData.comment }],
                            }
                            : review
                    )
                );
            } else {
                console.error("Error al actualizar la reseña:", result.mensaje);
            }
        } catch (error) {
            console.error("Error en la petición de actualización:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-screen-xl">
            {cargando ? (
                <div className="text-center text-gray-500 text-xl py-8">Cargando información...</div>
            ) : cabaña ? (
                <section className="bg-white rounded-lg shadow-md overflow-hidden">
                    <CabañaSwiper cabaña={cabaña} />

                    <div className="p-4 max-w-5xl mx-auto">
                        <h1 className="text-2xl font-semibold text-center text-lime-700 py-4">{cabaña.descripcion}</h1>




                        {cabaña.servicios && (
                            <div className="mt-6 ">
                                <div className="flex flex-wrap">
                                    {cabaña.servicios.length > 0 ? (
                                        cabaña.servicios.map((servicio) => (
                                            servicio.estado === 'Habilitado' &&
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
                                <div className='flex flex-wrap gap-4 mt-4 mx-10'>
                                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg  p-3 flex-1 border border-lime-300">
                                        <PiUsersThreeFill className="text-2xl text-lime-600" />
                                        <p className="text-gray-700">{cabaña.cantidadPersonas}</p>
                                        <p className="text-gray-700">Personas</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 flex-1 border border-lime-300">
                                        <MdOutlineBedroomChild className="text-2xl text-lime-600" />
                                        <p className="text-gray-700">{cabaña.cantidadHabitaciones}</p>
                                        <p className="text-gray-700">Habitaciones</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3  flex-1 border border-lime-300">
                                        <PiToiletBold className="text-2xl text-lime-600" />
                                        <p className="text-gray-700">{cabaña.cantidadBaños}</p>
                                        <p className="text-gray-700">Baños</p>
                                    </div>
                                </div>
                            </div>
                        )}


                        <div className="min-h-screen items-center justify-center bg-gray-100 hidden sm:inline">
                            <CalendarioReservas reservas={reservas} onReservar={handleReservar} precioPorNoche={cabaña.precio} minimoDias={cabaña.minimoDias} />
                        </div>
                        <div className='sm:hidden mt-4'>
                            <button onClick={handleShowCalendaro} className='flex items-center m-auto bg-lime-400 hover:bg-lime-600 p-3 rounded-lg text-center'>
                                <FaCalendarAlt className='mr-2' />
                                Ver calendario de reservas
                            </button>
                            <CalendarioModal isOpen={isCalModalOpen} onClose={() => setIsCalModalOpen(false)} reservas={reservas} onReservar={handleReservar} mensajeError={mensajeError} precioPorNoche={cabaña.precio} />
                        </div>

                        <div className='mt-4'>
                            <ComentariosList
                                reviews={comentarios}
                                onAddReview={handleAddReview}
                                userId={auth ? auth.id : null}
                                onUpdateReview={handleEditReview}
                            />
                        </div>
                    </div>
                </section>
            ) : (
                <div className="text-center text-gray-500">No se encontró la cabaña.</div>
            )}
            <ReservaInfo
                isOpen={isModalOpenR}
                onClose={handleCancelR}
                fechaInicio={fechaInicio}
                fechaFinal={fechaFinal}
                precioTotal={precioTotal}
                precioPorDia={cabaña && cabaña.precio}
                metodoPago={metodoPago}
                setMetodoPago={setMetodoPago}
                cbu={cbu}
                setCbu={setCbu}
                comprobante={comprobante}
                setComprobante={setComprobante}
                tarjeta={tarjeta}
                setTarjeta={setTarjeta}
                cuotas={cuotas}
                setCuotas={setCuotas}
                onConfirm={handleConfirmReservation}
                showConfirmButton={true}
                isGuest={!auth}
                guestInfo={guestInfo}
                onGuestInfoChange={handleGuestInfoChange}
            />
            <Modal
                isOpen={isModalOpen}
                onClose={handleCancel}
                title={modalTitle ? modalTitle : "Información de Reserva"}
                message={modalMessage}
            />
        </div>
    );
};