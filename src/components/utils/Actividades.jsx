import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { Peticion } from '../../helpers/Peticion';
import { FaCalendarAlt } from 'react-icons/fa';

export const Actividades = () => {
    const [expandedActivity, setExpandedActivity] = useState(null);
    const [actividades, setActividades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await Peticion(Global.url + "activity/getAllActivities", "GET", null, false, 'include');
                if (!response.datos) {
                    throw new Error('Error al obtener actividades');
                }
                setActividades(response.datos.activities);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const toggleExpand = (id) => {
        setExpandedActivity((prev) => (prev === id ? null : id));
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-6 p-4 w-full lg:w-5/6 m-auto">
                <h2 className="text-3xl font-bold text-center mb-6">¿Qué hacer en el Camping?</h2>
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 w-full mx-auto animate-pulse">
                        <div className="w-full md:w-2/6 h-48 bg-gray-200"></div>
                        <div className="w-full md:w-4/6 p-4 flex flex-col justify-between">
                            <div>
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-6">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-4 w-full lg:w-5/6 m-auto">
            <h2 className="text-3xl font-bold text-center mb-6">¿Qué hacer en el Camping?</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {actividades && actividades.map((actividad) => (
                    actividad.estado == 'Habilitado' && (
                        <div key={actividad._id} className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 w-full mx-auto">
                            <img className="w-full object-cover h-72 overflow-hidden" src={actividad.imagen} alt={`Imagen de ${actividad.titulo}`} />
                            <div className="w-full  p-4 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center">{actividad.titulo}</h2>
                                    <p className={`mt-2 text-sm sm:text-base pt-4 ${expandedActivity === actividad._id ? 'block' : 'hidden sm:block'}`}>
                                        {actividad.descripcion}
                                    </p>
                                    <p className={`mt-2 text-sm sm:text-base text-center ${expandedActivity === actividad._id ? 'hidden' : 'block sm:hidden'}`}>
                                        {`${actividad.descripcion.slice(0, 50)}...`}
                                    </p>
                                </div>
                                {(actividad.fechaInicio || actividad.fechaFinal) && (
                                    <div className="mt-4 text-gray-500 text-xs sm:text-sm flex gap-6 justify-center items-center">
                                        <FaCalendarAlt className="text-lime-600 h-6 w-6 " />
                                        <p>
                                            {actividad.fechaInicio && "Fecha de inicio: " + new Date(actividad.fechaInicio).toLocaleDateString()}
                                        </p>
                                        <p>
                                            {actividad.fechaFinal && "Fecha de finalización: " + new Date(actividad.fechaFinal).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                                {expandedActivity !== actividad._id && (
                                    <button className="mt-2 text-lime-600 hover:underline focus:outline-none sm:hidden" onClick={() => toggleExpand(actividad._id)}>
                                        Saber más
                                    </button>
                                )}
                                {expandedActivity === actividad._id && (
                                    <button className="mt-2 text-lime-600 hover:underline focus:outline-none sm:hidden" onClick={() => toggleExpand(actividad._id)}>
                                        Ocultar información
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};