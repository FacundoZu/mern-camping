import React, { useEffect, useState } from 'react';
import { Peticion } from '../../../helpers/Peticion';
import { Global } from '../../../helpers/Global';
import { PiUsersThreeFill, PiToiletBold } from "react-icons/pi";
import { MdOutlineBedroomChild } from "react-icons/md";
import { Link } from 'react-router-dom';

export const ListadoCabañas = ({ cabañas, cargando }) => {

    return (
        <div className="container mx-auto p-6">
            {cargando ? (
                <div className="text-center text-gray-500">Cargando...</div>
            ) : cabañas && cabañas.length === 0 ? (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded-lg text-center mt-4">
                    <h2 className="font-bold text-lg">No se encontraron cabañas</h2>
                    <p>Prueba ajustando tus filtros.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {cabañas && cabañas.map(cabaña => (
                        cabaña && cabaña.estado == 'Disponible' &&
                        <Link
                            to={`/cabaña/${cabaña._id}`}
                            key={cabaña._id}
                            className="rounded-lg shadow-md overflow-hidden w-full sm:w-full lg:w-full"
                        >
                            <div className="flex flex-col rounded-lg m-2 bg-white shadow-md lg:flex-row">
                                <img
                                    src={cabaña.imagenPrincipal}
                                    className='w-full lg:w-1/3 h-52 lg:h-auto object-cover rounded-l-md'
                                    alt={cabaña.nombre}
                                    title={cabaña.nombre}
                                />
                                <div className="p-4 flex-1 w-full">
                                    <h1 className="text-xl font-semibold mb-2">{cabaña.nombre}</h1>
                                    <h2 className="text-lg font-semibold mb-2">{cabaña.descripcion}</h2>
                                    {cabaña.imagenes && cabaña.imagenes.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mt-4">
                                            {cabaña.imagenes.slice(0, 3).map((imagen, index) => (
                                                <img
                                                    key={index}
                                                    src={imagen}
                                                    alt={`Imagen adicional ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-md"
                                                />
                                            ))}
                                        </div>
                                    )}
                                    <div className='flex m-2 gap-2'>
                                        <p className="mb-2 rounded-xl p-.5 px-2 text-black flex items-center">
                                            <PiUsersThreeFill className="mr-2 text-lime-700" />
                                            {cabaña.cantidadPersonas} Personas
                                        </p>
                                        <p className="mb-2 rounded-xl p-.5 px-2 text-black flex items-center "><MdOutlineBedroomChild className="mr-2 text-lime-700" />{cabaña.cantidadHabitaciones} Habitaciones</p>
                                        <p className="mb-2 rounded-xl p-.5 px-2 text-black flex items-center "><PiToiletBold className="mr-2 text-lime-700" />{cabaña.cantidadBaños} Baños</p>
                                    </div>
                                    <div className='flex gap-4 m-2'>
                                        {cabaña.servicios.length > 0 ? (
                                            cabaña.servicios.map((servicio) => (
                                                servicio.estado == 'Habilitado' &&
                                                <div key={servicio._id} className="relative group">
                                                    <img
                                                        src={servicio.imagen}
                                                        alt={servicio.nombre}
                                                        title={servicio.nombre}
                                                        className="w-auto h-10 rounded-lg bg-slate-200 p-2"
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <div>No hay servicios disponibles</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
