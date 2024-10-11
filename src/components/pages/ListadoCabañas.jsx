import React, { useEffect, useState } from 'react';
import { Peticion } from '../../helpers/Peticion';
import { Global } from '../../helpers/Global';
import { PiUsersThreeFill } from "react-icons/pi";
import { Link } from 'react-router-dom'; // Asegúrate de importar Link

export const ListadoCabañas = ({ filtros }) => {
    const [cabañas, setCabañas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const todasLasCabañas = async () => {
            let url = Global.url + "cabin/getCabins";

            const queryParams = new URLSearchParams(filtros).toString();
            if (queryParams) {
                url += `?${queryParams}`;
            }

            const { datos, cargando } = await Peticion(url, "GET", null, false, 'include');

            if (datos) {
                setCabañas(datos.cabins);
                setCargando(false);
            }
        };
        todasLasCabañas();
    }, [filtros]);

    return (
        <div className="container mx-auto p-6">
            {cargando ? (
                <div className="text-center text-gray-500">Cargando...</div>
            ) : cabañas.length === 0 ? (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded-lg text-center mt-4">
                    <h2 className="font-bold text-lg">No se encontraron cabañas</h2>
                    <p>Prueba ajustando tus filtros.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cabañas.map(cabaña => (
                        <Link to={`/cabaña/${cabaña._id}`} key={cabaña._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img src={cabaña.imagenPrincipal} className='w-full h-52 object-cover' alt="Imagen principal de la cabaña" />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold mb-2">{cabaña.descripcion}</h2>
                                <p className="text-gray-700 flex items-center mb-2">
                                    <PiUsersThreeFill className="mr-2 text-blue-500" />
                                    {cabaña.cantidadPersonas} Personas
                                </p>
                                <p className="text-gray-700 mb-2">{cabaña.cantidadHabitaciones} Habitaciones</p>
                                <p className="text-gray-700 mb-2">{cabaña.cantidadBaños} Baños</p>
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
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
