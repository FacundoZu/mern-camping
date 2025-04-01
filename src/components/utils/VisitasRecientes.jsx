import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Peticion } from '../../helpers/Peticion';
import { Global } from '../../helpers/Global';
import { Link } from 'react-router-dom';
import { PiToiletBold, PiUsersThreeFill } from 'react-icons/pi';
import { MdOutlineBedroomChild } from 'react-icons/md';

export default function VisitasRecientes() {
    const { auth } = useAuth();
    const [visitedCabañas, setVisitedCabañas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVisitedCabañas = async () => {
            if (!auth || !auth.id) return;
            try {
                const { datos } = await Peticion(
                    `${Global.url}user/registerVisit/${auth.id}`,
                    "GET",
                    null,
                    false,
                    'include'
                );

                if (datos) {
                    setVisitedCabañas(datos);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchVisitedCabañas();
    }, [auth]);

    const renderSkeleton = () => {
        return (
            <div className="md:p-10 bg-gray-200 w-full m-auto border">
                <h2 className='py-5 text-center text-3xl font-bold'>Cabañas vistas recientemente</h2>
                <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5'>
                    {[1, 2, 3].map((_, index) => (
                        <li key={index}>
                            <div className="bg-white rounded-xl shadow-md h-full">
                                <div className="animate-pulse">
                                    <div className="bg-gray-300 h-48 rounded-t-xl"></div>
                                    <div className="p-4">
                                        <div className="bg-gray-300 h-6 w-3/4 mb-2 rounded"></div>
                                        <div className="bg-gray-300 h-4 w-full mb-2 rounded"></div>
                                        <div className="bg-gray-300 h-4 w-2/3 mb-2 rounded"></div>
                                        <div className="flex gap-2 mt-2">
                                            <div className="bg-gray-300 h-8 w-8 rounded-full"></div>
                                            <div className="bg-gray-300 h-8 w-8 rounded-full"></div>
                                            <div className="bg-gray-300 h-8 w-8 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    if (visitedCabañas.length > 0 && loading) {
        return renderSkeleton();
    }

    if (visitedCabañas.length > 0) return (
        <div className="md:p-10 bg-gray-200 w-full m-auto border">
            <h2 className='py-5 text-center text-3xl font-bold'>Cabañas vistas recientemente</h2>
            <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5'>
                {visitedCabañas.map((cabaña) => (
                    <li key={cabaña._id} className="flex">
                        <Link to={`/cabaña/${cabaña._id}`} className="flex-1">
                            <div className="bg-white rounded-xl hover:transition-all hover:scale-105 shadow-md hover:shadow-xl h-full flex flex-col">
                                <img
                                    src={cabaña.imagenPrincipal}
                                    alt={cabaña.nombre}
                                    className={`rounded-t-xl w-full h-48 object-cover transition-opacity duration-300`}

                                    onLoad={() => setLoading(false)}
                                />
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className='text-xl font-semibold'>{cabaña.nombre}</h3>
                                    <p className='text-gray-600 flex-1'>{cabaña.descripcion}</p>
                                    <div className='flex flex-wrap gap-2 mt-2'>
                                        {cabaña.servicios.length > 0 && (
                                            cabaña.servicios.map((servicio) => (
                                                servicio.estado === 'Habilitado' && (
                                                    <div key={servicio._id} className="relative group">
                                                        <img
                                                            src={servicio.imagen}
                                                            alt={servicio.nombre}
                                                            title={servicio.nombre}
                                                            className="w-auto h-8 lg:h-10 rounded-lg border p-2"

                                                        />
                                                    </div>
                                                )
                                            ))
                                        )}
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <p className="rounded-xl p-1 px-2 text-black flex items-center">
                                            <PiUsersThreeFill className="mr-2 text-lime-700" />
                                            {cabaña.cantidadPersonas}
                                        </p>
                                        <p className="rounded-xl p-1 px-2 text-black flex items-center">
                                            <MdOutlineBedroomChild className="mr-2 text-lime-700" />
                                            {cabaña.cantidadHabitaciones}
                                        </p>
                                        <p className="rounded-xl p-1 px-2 text-black flex items-center">
                                            <PiToiletBold className="mr-2 text-lime-700" />
                                            {cabaña.cantidadBaños}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}