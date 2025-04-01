import React, { useEffect, useState, useRef } from 'react';
import { Global } from '../../helpers/Global';
import { Peticion } from '../../helpers/Peticion';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

export const Actividades = () => {
    const [actividades, setActividades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);

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

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === actividades.filter(a => a.estado === 'Habilitado').length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? actividades.filter(a => a.estado === 'Habilitado').length - 1 : prevIndex - 1
        );
    };

    if (loading) {
        return (
            <div className="relative w-full h-[500px] bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="h-10 bg-gray-300 rounded-lg w-48 mx-auto mb-6 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-64 mx-auto animate-pulse"></div>
                </div>
            </div>
        );
    }

    const enabledActivities = actividades.filter(a => a.estado === 'Habilitado');

    return (
        <div className="relative w-full overflow-hidden py-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8 px-4"
            >
                <h2 className="text-4xl font-bold text-white mb-4 ">
                    Experiencias en la Naturaleza
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                    Descubre las actividades que harán de tu estadía una aventura inolvidable
                </p>
            </motion.div>

            <div className="relative w-full max-w-6xl mx-auto">
                <div
                    ref={carouselRef}
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {enabledActivities.map((actividad, index) => (
                        <div
                            key={actividad._id}
                            className="w-full flex-shrink-0 px-4"
                        >
                            <div className="relative h-[500px] rounded-2xl overflow-hidden">
                                <img
                                    className="absolute inset-0 w-full h-full object-cover"
                                    src={actividad.imagen}
                                    alt={actividad.titulo}
                                    loading="lazy"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                <div className="relative h-full flex flex-col justify-end p-8 text-white">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-6"
                                    >
                                        <h3 className="text-3xl font-bold mb-2">{actividad.titulo}</h3>
                                        <p className="text-lg opacity-90">{actividad.descripcion}</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(actividad.fechaInicio || actividad.fechaFinal) && (
                                                <div className="flex items-center">
                                                    <FaCalendarAlt className="text-lime-400 mr-3 text-xl" />
                                                    <div>
                                                        <p className="text-sm opacity-80">Fecha</p>
                                                        <p className="font-medium">
                                                            {actividad.fechaInicio && new Date(actividad.fechaInicio).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                                                            {actividad.fechaFinal && ` - ${new Date(actividad.fechaFinal).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {actividad.duracion && (
                                                <div className="flex items-center">
                                                    <FaClock className="text-lime-400 mr-3 text-xl" />
                                                    <div>
                                                        <p className="font-medium">{actividad.duracion}</p>
                                                        <p className="text-sm opacity-80">Duración</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {enabledActivities.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full backdrop-blur-sm z-10 transition-all"
                            aria-label="Anterior"
                        >
                            <FaChevronLeft className="text-xl" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full backdrop-blur-sm z-10 transition-all"
                            aria-label="Siguiente"
                        >
                            <FaChevronRight className="text-xl" />
                        </button>
                    </>
                )}

                {enabledActivities.length > 1 && (
                    <div className="flex justify-center mt-6 space-x-2">
                        {enabledActivities.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all ${currentIndex === index ? 'bg-lime-400 w-6' : 'bg-white/30'}`}
                                aria-label={`Ir a la actividad ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Estado vacío */}
            {enabledActivities.length === 0 && !loading && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Próximamente nuevas experiencias</h3>
                    <p className="text-gray-300">Estamos preparando actividades especiales para ti</p>
                </div>
            )}
        </div>
    );
};