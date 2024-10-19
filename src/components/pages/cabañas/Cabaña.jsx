import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Peticion } from '../../../helpers/Peticion';
import { Global } from '../../../helpers/Global';
import { PiUsersThreeFill, PiToiletBold } from "react-icons/pi";
import { MdOutlineBedroomChild } from "react-icons/md";

import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CalendarioReservas from './CalendarioReservas';

export const Cabaña = () => {
    const { id } = useParams();
    const [cabaña, setCabaña] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerCabaña = async () => {
            const url = `${Global.url}cabin/getCabin/${id}`;
            console.log(url)
            const { datos, cargando } = await Peticion(url, "GET", null, false, 'include');

            if (datos) {
                setCabaña(datos.cabin);
                setCargando(false);
            }
        };
        obtenerCabaña();
    }, [id]);

    const reservas = [
        { start: '2024-10-20', end: '2024-10-25' },
        { start: '2024-11-01', end: '2024-11-05' },
        { start: '2024-12-10', end: '2024-12-12' },
    ];

    return (
        <div className="container mx-auto p-6">
            {cargando ? (
                <div className="text-center text-gray-500">Cargando...</div>
            ) : cabaña ? (
                <section className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        pagination={{ clickable: true }}
                        className='h-[600px] justify-center flex items-center text-center'
                    >
                        <SwiperSlide>
                            <div>
                                <img src={cabaña.imagenPrincipal} className='w-full h-[600px] object-cover' alt="Imagen principal de la cabaña" />
                            </div>
                        </SwiperSlide>

                        {cabaña.imagenes && cabaña.imagenes.map((imagen, index) => (
                            <SwiperSlide key={index}>
                                <div>
                                    <img src={imagen} className='w-full h-[600px] object-cover' alt={`Imagen adicional ${index + 1}`} />
                                </div>
                            </SwiperSlide>
                        ))}
                        <div className="swiper-button-prev swiper-button-prev-custom text-lime-400 hover:text-lime-500"></div>
                        <div className="swiper-button-next swiper-button-next-custom text-lime-400 hover:text-lime-500"></div>
                    </Swiper>

                    <div className="p-4">
                        <div className='flex gap-2'>
                            <p className="mb-2 bg-lime-200 rounded-xl shadow-md p-.5 px-2 text-black flex items-center">
                                <PiUsersThreeFill className="mr-2 text-lime-700" />
                                {cabaña.cantidadPersonas} Personas
                            </p>
                            <p className="mb-2 bg-lime-200 rounded-xl shadow-md p-.5 px-2 text-black flex items-center">
                                <MdOutlineBedroomChild className="mr-2 text-lime-700" />
                                {cabaña.cantidadHabitaciones} Habitaciones
                            </p>
                            <p className="mb-2 bg-lime-200 rounded-xl shadow-md p-.5 px-2 text-black flex items-center">
                                <PiToiletBold className="mr-2 text-lime-700" />
                                {cabaña.cantidadBaños} baño
                            </p>
                        </div>
                        <h1 className="text-2xl font-bold mb-2">{cabaña.descripcion}</h1>

                        <div className="container mx-auto mt-6">
                            <CalendarioReservas reservas={reservas} />
                        </div>

                        <div className="mt-6">
                            <button className="bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-lime-600">
                                Reservar
                            </button>
                        </div>
                    </div>
                </section>
            ) : (
                <div className="text-center text-gray-500">No se encontró la cabaña.</div>
            )}
        </div>

    );
};
