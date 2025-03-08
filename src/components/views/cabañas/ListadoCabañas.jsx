import React, { useState } from 'react';
import { PiUsersThreeFill, PiToiletBold } from "react-icons/pi";
import { MdOutlineBedroomChild } from "react-icons/md";
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { SkeletonCabaña } from './SkeletonCabaña';

export const ListadoCabañas = ({ cabañas, cargando, checkIn, checkOut }) => {
    const [imagenesCargadas, setImagenesCargadas] = useState({});

    const handleImageLoad = (id) => {
        setImagenesCargadas((prev) => ({ ...prev, [id]: true }));
    };

    return (
        <div className="mx-auto">
            {cargando ? (
                <div>
                    <SkeletonCabaña />
                    <SkeletonCabaña />
                    <SkeletonCabaña />
                </div>
            ) : cabañas && cabañas.length === 0 ? (
                <div className="bg-yellow-100 border flex flex-col w-full border-yellow-400 text-yellow-700 p-4 rounded-lg text-center mt-4">
                    <h2 className="font-bold text-lg">No se encontraron cabañas</h2>
                    <p>Prueba ajustando tus filtros.</p>
                </div>
            ) : (
                <div>
                    {cabañas && cabañas.map((cabaña) => (
                        cabaña && cabaña.estado === 'Disponible' && (
                            <Link
                                to={`/cabaña/${cabaña._id}?checkIn=${checkIn}&checkOut=${checkOut}`}
                                key={cabaña._id}
                                className="rounded-lg shadow-md overflow-hidden"
                            >
                                <div className="flex flex-col rounded-lg my-4 bg-white shadow-md lg:flex-row">
                                    <div className="w-full lg:w-1/3 h-52 lg:h-auto relative">
                                        {!imagenesCargadas[cabaña._id] && (
                                            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-l-md"></div>
                                        )}
                                        <img
                                            src={cabaña.imagenPrincipal}
                                            alt={cabaña.nombre}
                                            title={cabaña.nombre}
                                            className={`w-full h-full object-cover rounded-l-md ${imagenesCargadas[cabaña._id] ? 'opacity-100' : 'opacity-0'
                                                } transition-opacity duration-300`}
                                            onLoad={() => handleImageLoad(cabaña._id)}
                                        />
                                    </div>

                                    <div className="p-4 flex-1 w-full">
                                        <h1 className="text-xl font-semibold mb-2">{cabaña.nombre}</h1>
                                        <h2 className="text-lg font-semibold mb-2">{cabaña.descripcion}</h2>

                                        {cabaña.imagenes && cabaña.imagenes.length > 0 && (
                                            <div className="grid grid-cols-3 gap-2 mt-4">
                                                {cabaña.imagenes.slice(0, 3).map((imagen, index) => (
                                                    <div key={index} className="relative h-32">
                                                        {!imagenesCargadas[`${cabaña._id}-${index}`] && (
                                                            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md"></div>
                                                        )}
                                                        <img
                                                            src={imagen}
                                                            alt={`Imagen adicional ${index + 1}`}
                                                            className={`w-full h-full object-cover rounded-md ${imagenesCargadas[`${cabaña._id}-${index}`] ? 'opacity-100' : 'opacity-0'
                                                                } transition-opacity duration-300`}
                                                            onLoad={() => handleImageLoad(`${cabaña._id}-${index}`)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex m-2 gap-2">
                                            <p className="mb-2 rounded-xl p-.5 px-2 text-black flex items-center">
                                                <PiUsersThreeFill className="mr-2 text-lime-700" />
                                                {cabaña.cantidadPersonas} Personas
                                            </p>
                                            <p className="mb-2 rounded-xl p-.5 px-2 text-black flex items-center">
                                                <MdOutlineBedroomChild className="mr-2 text-lime-700" />
                                                {cabaña.cantidadHabitaciones} Habitaciones
                                            </p>
                                            <p className="mb-2 rounded-xl p-.5 px-2 text-black flex items-center">
                                                <PiToiletBold className="mr-2 text-lime-700" />
                                                {cabaña.cantidadBaños} Baños
                                            </p>
                                        </div>

                                        <div className="flex gap-4 m-2">
                                            {cabaña.servicios.length > 0 ? (
                                                cabaña.servicios.map((servicio) => (
                                                    servicio.estado === 'Habilitado' && (
                                                        <div key={servicio._id} className="relative group">
                                                            <img
                                                                src={servicio.imagen}
                                                                alt={servicio.nombre}
                                                                title={servicio.nombre}
                                                                className="w-auto h-10 rounded-lg bg-slate-200 p-2"
                                                            />
                                                        </div>
                                                    )
                                                ))
                                            ) : (
                                                <div>No hay servicios disponibles</div>
                                            )}

                                            <div className="flex flex-col items-center ml-auto mb-4">
                                                <div className="flex items-center">
                                                    {Array.from({ length: 5 }, (_, index) => (
                                                        <FaStar
                                                            key={index}
                                                            className={`cursor-pointer ${index < cabaña.promedioRating ? "text-yellow-500" : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                    <h2 className="px-1">{cabaña.promedioRating}</h2>
                                                </div>

                                                <p className="text-center text-sm text-gray-500">
                                                    {cabaña.reviews && cabaña.reviews.length} opiniones
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};