import React, { useEffect, useState } from 'react';
import { Global } from '../../../helpers/Global';
import { Peticion } from '../../../helpers/Peticion';

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

    if (loading) return <p className="text-center text-gray-500">Cargando actividades...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="flex flex-col gap-6 p-4 max-w-screen-2xl m-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Que hacer en el Camping</h2> 
            {actividades && actividades.map((actividad) => (
                actividad.estado == 'Habilitado' &&
                <div key={actividad._id} className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 w-full mx-auto">
                    <img className="w-full md:w-1/4 object-cover h-auto" src={actividad.imagen} alt={`Imagen de ${actividad.titulo}`} />
                    <div className="w-full md:w-3/4 p-4 flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">{actividad.titulo}</h2>
                            <p className={`mt-2 text-sm sm:text-base text-center pt-4 ${expandedActivity === actividad._id ? 'block' : 'hidden sm:block'}`}>
                                {actividad.descripcion}
                            </p>
                            <p className={`mt-2 text-sm sm:text-base text-center ${expandedActivity === actividad._id ? 'hidden' : 'block sm:hidden'}`}>
                                {`${actividad.descripcion.slice(0, 50)}...`}
                            </p>
                        </div>
                        {(actividad.fechaInicio || actividad.fechaFinal) && (
                            <div className="mt-4 text-gray-500 text-xs sm:text-sm">
                                <p>
                                    Fecha de inicio: {actividad.fechaInicio ? new Date(actividad.fechaInicio).toLocaleDateString() : 'No especificada'}
                                </p>
                                <p>
                                    Fecha de finalización: {actividad.fechaFinal ? new Date(actividad.fechaFinal).toLocaleDateString() : 'No especificada'}
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
            ))}
        </div>
    );
};
