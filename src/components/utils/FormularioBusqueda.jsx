import React, { useState, useRef, useEffect } from "react";
import { RiLeafFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // Estilos principales
import "react-date-range/dist/theme/default.css"; // Tema por defecto

const FormularioBusqueda = () => {
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const [showCalendar, setShowCalendar] = useState(false); // Estado para mostrar/ocultar el calendario
    const [showTravelersModal, setShowTravelersModal] = useState(false); // Estado para mostrar/ocultar el modal de viajeros
    const [travelers, setTravelers] = useState(1); // Cantidad de viajeros
    const [rooms, setRooms] = useState(1); // Cantidad de habitaciones
    const calendarRef = useRef(null); // Referencia para el calendario
    const travelersRef = useRef(null); // Referencia para el modal de viajeros

    // Manejar la selección de fechas
    const handleSelect = (ranges) => {
        const { startDate, endDate } = ranges.selection;
        setState([{ startDate, endDate, key: "selection" }]);
    };

    // Formatear fechas para mostrarlas en los inputs
    const formatDate = (date) => format(date, "dd/MM/yyyy");

    // Cerrar el calendario y el modal al hacer clic fuera de ellos
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
            if (travelersRef.current && !travelersRef.current.contains(event.target)) {
                setShowTravelersModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/ruta/a/tu/imagen-de-fondo.jpg)' }}>
            <div className="text-center">
                {/* Título */}
                <h1 className="flex items-center justify-center font-bold text-5xl sm:text-7xl lg:text-8xl mb-8">
                    <RiLeafFill className="text-lime-600 text-6xl sm:text-8xl lg:text-9xl mr-2" />
                    <span className="text-white">Camping</span>
                    <span className="text-lime-400 ml-2">Cachi</span>
                </h1>

                {/* Formulario de búsqueda */}
                <section className="bg-black/50 rounded-lg p-6 shadow-lg relative">
                    <form className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                        {/* Campo de Check-in */}
                        <div className="flex justify-end items-end gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="check-in" className="text-white text-sm font-medium mb-1">
                                    Check-in
                                </label>
                                <input
                                    type="text"
                                    id="check-in"
                                    value={formatDate(state[0].startDate)}
                                    readOnly
                                    onClick={() => setShowCalendar(true)}
                                    className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400 cursor-pointer"
                                />
                            </div>

                            {/* Campo de Check-out */}
                            <div className="flex flex-col">
                                <label htmlFor="check-out" className="text-white text-sm font-medium mb-1">
                                    Check-out
                                </label>
                                <input
                                    type="text"
                                    id="check-out"
                                    value={formatDate(state[0].endDate)}
                                    readOnly
                                    onClick={() => setShowCalendar(true)}
                                    className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400 cursor-pointer"
                                />
                            </div>

                            {/* Campo de Viajeros y Habitaciones */}
                            <div className="flex flex-col relative">
                                <label htmlFor="viajeros" className="text-white text-sm font-medium">
                                    Viajeros y Habitaciones
                                </label>
                                <input
                                    type="text"
                                    id="viajeros"
                                    value={`${travelers} Viajeros, ${rooms} Habitaciones`}
                                    readOnly
                                    onClick={() => setShowTravelersModal(true)}
                                    className="p-2 mt-1 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400 cursor-pointer"
                                />
                                {/* Modal de Viajeros y Habitaciones */}
                                {showTravelersModal && (
                                    <div ref={travelersRef} className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg p-4 w-64 top-full left-0">
                                        <div className="flex justify-between items-center mb-4">
                                            <span>Viajeros</span>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    type="button" // Evita que el botón envíe el formulario
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setTravelers((prev) => (prev > 1 ? prev - 1 : 1));
                                                    }}
                                                    className="px-2 py-1 bg-gray-200 rounded-md"
                                                >
                                                    -
                                                </button>
                                                <span>{travelers}</span>
                                                <button
                                                    type="button" // Evita que el botón envíe el formulario
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setTravelers((prev) => prev + 1);
                                                    }}
                                                    className="px-2 py-1 bg-gray-200 rounded-md"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Habitaciones</span>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    type="button" // Evita que el botón envíe el formulario
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setRooms((prev) => (prev > 1 ? prev - 1 : 1));
                                                    }}
                                                    className="px-2 py-1 bg-gray-200 rounded-md"
                                                >
                                                    -
                                                </button>
                                                <span>{rooms}</span>
                                                <button
                                                    type="button" // Evita que el botón envíe el formulario
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setRooms((prev) => prev + 1);
                                                    }}
                                                    className="px-2 py-1 bg-gray-200 rounded-md"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Botón de búsqueda */}
                            <button
                                type="submit"
                                className="px-6 py-2 font-bold  bg-lime-600 text-white rounded-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                            >
                                Buscar
                            </button>

                        </div>
                    </form>

                    {/* Calendario */}
                    {showCalendar && (
                        <div ref={calendarRef} className="absolute z-10 mt-2 left-16 w-full max-w-[21rem]">
                            <DateRange
                                editableDateInputs={true}
                                onChange={handleSelect}
                                moveRangeOnFirstSelection={false}
                                ranges={state}
                                minDate={new Date()} // Fecha mínima: hoy
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                    )}

                    {/* Enlace para ver todas las cabañas */}
                    <Link
                        to="/cabañas"
                        className="mt-4 inline-block px-6 py-3 bg-lime-600 text-white text-lg rounded-md shadow-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                    >
                        Ver todas las cabañas
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default FormularioBusqueda;