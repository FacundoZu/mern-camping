import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Peticion } from '../../helpers/Peticion';
import { Global } from '../../helpers/Global';
import { PiUsersThreeFill } from "react-icons/pi";

export const Cabaña = () => {
    const { id } = useParams(); // Obtener el ID de la cabaña de la URL
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

    return (
        <div className="container mx-auto p-6">
            {cargando ? (
                <div className="text-center text-gray-500">Cargando...</div>
            ) : cabaña ? (
                <section className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img src={cabaña.imagenPrincipal} className='w-full h-72 object-cover' alt="Imagen principal de la cabaña" />
                    <div className="p-4">
                        <h1 className="text-2xl font-bold mb-2">{cabaña.descripcion}</h1>
                        <p className="text-gray-700 flex items-center mb-2">
                            <PiUsersThreeFill className="mr-2 text-blue-500" />
                            Capacidad: {cabaña.cantidadPersonas} Personas
                        </p>
                        <p className="text-gray-700 mb-2">Habitaciones: {cabaña.cantidadHabitaciones}</p>
                        <p className="text-gray-700 mb-2">Baños: {cabaña.cantidadBaños}</p>

                        {cabaña.imagenes && (
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {cabaña.imagenes.map((imagen, index) => (
                                    <img
                                        key={index}
                                        src={imagen}
                                        alt={`Imagen adicional ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-md"
                                    />
                                ))}
                            </div>
                        )}

                        <div className="mt-6">
                            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
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
