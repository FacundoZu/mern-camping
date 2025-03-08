import React, { useState, useRef, useEffect } from "react";
import { RiLeafFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const FormularioBusqueda = () => {
    const navigate = useNavigate();

    const [state, setState] = useState([
        { startDate: new Date(), endDate: new Date(), key: "selection" },
    ]);
    const [hasSelectedDates, setHasSelectedDates] = useState(false);

    const [showCalendar, setShowCalendar] = useState(false);
    const [showTravelersModal, setShowTravelersModal] = useState(false);
    const [travelers, setTravelers] = useState(0);
    const [rooms, setRooms] = useState(0);
    const calendarRef = useRef(null);
    const travelersRef = useRef(null);

    const handleSelect = (ranges) => {
        const { startDate, endDate } = ranges.selection;
        setState([{ startDate, endDate, key: "selection" }]);
        setHasSelectedDates(true);
    };

    const formatDate = (date) => (date ? format(date, "dd-MM-yyyy") : null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams({
            checkIn: hasSelectedDates && state[0].startDate ? formatDate(state[0].startDate) : "",
            checkOut: hasSelectedDates && state[0].endDate ? formatDate(state[0].endDate) : "",
            travelers: travelers > 0 ? travelers : "",
            rooms: rooms > 0 ? rooms : "",
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
        <div className="flex items-center mt-36 bg-cover bg-center">
            <div className="text-center">
                <h1 className="flex items-center justify-center font-bold text-5xl sm:text-7xl lg:text-8xl mb-8">
                    <RiLeafFill className="text-lime-600 text-6xl sm:text-8xl lg:text-9xl mr-2" />
                    <span className="text-white">Camping</span>
                    <span className="text-lime-400 ml-2">Cachi</span>
                </h1>

                <section className="rounded-3xl p-6 bg-white shadow-lg relative">
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                        <div className="flex justify-end items-end gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="check-in" className=" text-sm font-medium mb-1">
                                    Check-in
                                </label>
                                <input
                                    type="text"
                                    id="check-in"
                                    value={hasSelectedDates && state[0].startDate ? formatDate(state[0].startDate) : "¿Cuándo?"}
                                    readOnly
                                    onClick={() => setShowCalendar(true)}
                                    className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400 cursor-pointer"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="check-out" className=" text-sm font-medium mb-1">
                                    Check-out
                                </label>
                                <input
                                    type="text"
                                    id="check-out"
                                    value={hasSelectedDates && state[0].endDate ? formatDate(state[0].endDate) : "¿Cuándo?"}
                                    readOnly
                                    onClick={() => setShowCalendar(true)}
                                    className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400 cursor-pointer"
                                />
                            </div>

                            <div className="flex flex-col relative">
                                <label htmlFor="viajeros" className=" text-sm font-medium">
                                    Viajeros y Habitaciones
                                </label>
                                <input
                                    type="text"
                                    id="viajeros"
                                    value={
                                        travelers > 0 || rooms > 0
                                            ? `${travelers} Viajeros, ${rooms} Habitaciones`
                                            : "¿Cuántos?"
                                    }
                                    readOnly
                                    onClick={() => setShowTravelersModal(true)}
                                    className="p-2 mt-1 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400 cursor-pointer"
                                />
                                {showTravelersModal && (
                                    <div ref={travelersRef} className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg p-4 w-64 top-full left-0">
                                        <div className="flex justify-between items-center mb-4">
                                            <span>Viajeros</span>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setTravelers(Math.max(0, travelers - 1))}
                                                    className="px-2 py-1 bg-gray-200 rounded-md"
                                                >
                                                    -
                                                </button>
                                                <span>{travelers}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setTravelers(travelers + 1)}
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
                                                    type="button"
                                                    onClick={() => setRooms(Math.max(0, rooms - 1))}
                                                    className="px-2 py-1 bg-gray-200 rounded-md"
                                                >
                                                    -
                                                </button>
                                                <span>{rooms}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setRooms(rooms + 1)}
                                                    className="px-2 py-1 bg-gray-200 rounded-md"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="px-6 py-2 font-bold bg-lime-600 text-white rounded-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                            >
                                Buscar
                            </button>
                        </div>
                    </form>

                    {showCalendar && (
                        <div ref={calendarRef} className="absolute z-10 mt-2 left-16 w-full max-w-[21rem]">
                            <DateRange
                                editableDateInputs={true}
                                onChange={handleSelect}
                                showDateDisplay={false}
                                moveRangeOnFirstSelection={false}
                                rangeColors={["#65a30d"]}
                                ranges={state}
                                minDate={new Date()}
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default FormularioBusqueda;