import React, { useState, useRef, useEffect } from "react";
import { RiLeafFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { formatDate } from "../../helpers/ParseDate";

const FormularioBusqueda = () => {
    const navigate = useNavigate();

    const [state, setState] = useState([
        { startDate: new Date(), endDate: new Date(), key: "selection" },
    ]);
    const [hasSelectedDates, setHasSelectedDates] = useState(false);

    const [showCalendar, setShowCalendar] = useState(false);
    const [showTravelersModal, setShowTravelersModal] = useState(false);
    const [cantidadPersonas, setCantidadPersonas] = useState(0);
    const calendarRef = useRef(null);
    const travelersRef = useRef(null);

    const handleSelect = (ranges) => {
        const { startDate, endDate } = ranges.selection;
        setState([{ startDate, endDate, key: "selection" }]);
        setHasSelectedDates(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams({
            checkIn: hasSelectedDates && state[0].startDate ? formatDate(state[0].startDate) : "",
            checkOut: hasSelectedDates && state[0].endDate ? formatDate(state[0].endDate) : "",
            cantidadPersonas: cantidadPersonas > 0 ? cantidadPersonas : "",
        }).toString();

        navigate(`/cabañas?${queryParams}`);
    };

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
        <div className="flex items-center justify-center min-h-[50vh] md:min-h-[70vh] bg-cover bg-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-6xl text-center">
                <h1 className="flex flex-col sm:flex-row items-center justify-center font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-6 sm:mb-8">
                    <RiLeafFill className="text-lime-600 text-5xl sm:text-6xl lg:text-7xl mr-0 sm:mr-2 mb-2 sm:mb-0" />
                    <span className="text-white">Camping</span>
                    <span className="text-lime-400 ml-0 sm:ml-2">Cachi</span>
                </h1>

                <section className="rounded-2xl sm:rounded-3xl px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-4 bg-white bg-opacity-80 shadow-lg relative w-full max-w-4xl mx-auto">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                        Reservar
                    </h3>
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 w-full">
                            {/* Check-in */}
                            <div className="flex flex-col w-full md:w-auto">
                                <label htmlFor="check-in" className="text-xs sm:text-sm font-medium mb-1 text-left">
                                    Check-in
                                </label>
                                <input
                                    type="text"
                                    id="check-in"
                                    value={hasSelectedDates && state[0].startDate ? formatDate(state[0].startDate) : "¿Cuándo?"}
                                    readOnly
                                    onClick={() => setShowCalendar(true)}
                                    className="p-2 text-sm sm:text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-400 cursor-pointer w-full"
                                />
                            </div>

                            {/* Check-out */}
                            <div className="flex flex-col w-full md:w-auto">
                                <label htmlFor="check-out" className="text-xs sm:text-sm font-medium mb-1 text-left">
                                    Check-out
                                </label>
                                <input
                                    type="text"
                                    id="check-out"
                                    value={hasSelectedDates && state[0].endDate ? formatDate(state[0].endDate) : "¿Cuándo?"}
                                    readOnly
                                    onClick={() => setShowCalendar(true)}
                                    className="p-2 text-sm sm:text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-400 cursor-pointer w-full"
                                />
                            </div>

                            {/* Viajeros */}
                            <div className="flex flex-col w-full md:w-auto relative">
                                <label htmlFor="viajeros" className="text-xs sm:text-sm font-medium text-left">
                                    Viajeros
                                </label>
                                <input
                                    type="text"
                                    id="viajeros"
                                    value={
                                        cantidadPersonas > 0
                                            ? cantidadPersonas == 1
                                                ? `${cantidadPersonas} Persona`
                                                : `${cantidadPersonas} Personas`
                                            : "¿Cuántos?"
                                    }
                                    readOnly
                                    onClick={() => setShowTravelersModal(true)}
                                    className="p-2 text-sm sm:text-base mt-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-400 cursor-pointer w-full"
                                />
                                {showTravelersModal && (
                                    <div ref={travelersRef} className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg p-4 w-full sm:w-64 top-full left-0">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm sm:text-base">Viajeros</span>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setCantidadPersonas(Math.max(0, cantidadPersonas - 1))}
                                                    className="px-2 py-1 bg-gray-200 rounded-md text-sm sm:text-base"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm sm:text-base">{cantidadPersonas}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setCantidadPersonas(cantidadPersonas + 1)}
                                                    className="px-2 py-1 bg-gray-200 rounded-md text-sm sm:text-base"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Botón Buscar */}
                            <button
                                type="submit"
                                className="px-4 sm:px-6 py-2 text-sm sm:text-base font-bold bg-lime-600 text-white rounded-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all w-full md:w-auto mt-2 sm:mt-0"
                            >
                                Buscar
                            </button>
                        </div>
                    </form>

                    {showCalendar && (
                        <div ref={calendarRef} className="absolute z-10 mt-2 left-0 right-0 mx-auto w-full max-w-xs sm:max-w-md md:max-w-lg">
                            <DateRange
                                editableDateInputs={true}
                                onChange={handleSelect}
                                showDateDisplay={false}
                                moveRangeOnFirstSelection={false}
                                rangeColors={["#65a30d"]}
                                ranges={state}
                                minDate={new Date()}
                                className="rounded-lg shadow-lg w-full"
                            />
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default FormularioBusqueda;