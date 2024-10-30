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

export const Cabaña = () => {
    const { id } = useParams();
    const [cabaña, setCabaña] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [reservas, setReservas] = useState([]);
    const [mensajeError, setMensajeError] = useState(null);
    const { auth } = useAuth();

    const [isCalModalOpen, setIsCalModalOpen] = useState(false);

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

    const handleReservar = async (fechas) => {
        const nuevaReserva = {
            usuarioId: auth.id,
            cabaniaId: cabaña._id,
            fechaInicio: fechas.fechaInicio,
            fechaFinal: fechas.fechaFinal,
            precioTotal: calcularPrecioTotal(fechas.fechaInicio, fechas.fechaFinal)
        };

        const url = `${Global.url}reservation/createReservation`;

        try {
            const response = await Peticion(url, 'POST', nuevaReserva, false, 'include');

            if (response.datos?.status === 'success') {
                setMensajeError(null);
                setReservas((prevReservas) => [...prevReservas, nuevaReserva]);
                return response
            } else if (response.datos?.mensaje) {
                setMensajeError(response.datos.mensaje);
            }
        } catch (error) {
            setMensajeError('Error al guardar la reserva, intenta nuevamente.');
            console.error(error);
        }
    };

    const handleShowCalendaro = () => {
        setIsCalModalOpen(true)
    }

    return (
        <div className="container mx-auto p-6 max-w-screen-xl">
            {cargando ? (
                <div className="text-center text-gray-500 text-xl py-8">Cargando información...</div>
            ) : cabaña ? (
                <section className="bg-white rounded-lg shadow-md overflow-hidden">
                    <CabañaSwiper cabaña={cabaña} />
                    <div className="p-4">

                        <h1 className="text-2xl font-semibold text-center text-lime-700 py-4">{cabaña.descripcion}</h1>
                        <hr className='mt-4'/>
                        {cabaña.servicios && (
                            <div className="mt-6">
                                <div className="flex flex-wrap">
                                    {cabaña.servicios.length > 0 ? (
                                        cabaña.servicios.map((servicio) => (
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
                        <hr className='pt-4 mt-8'/>
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
        </div>
    );
};
