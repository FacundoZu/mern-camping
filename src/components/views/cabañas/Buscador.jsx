import { useEffect, useRef, useState } from "react";
import { useForm } from "../../../hooks/useForm";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { parseDate } from "../../../helpers/ParseDate";

export const Buscador = ({ setFiltros, todasLasCabañas, cabañas, filtros }) => {
    const { formulario, cambiado, setFormulario } = useForm({
        checkIn: filtros.checkIn || "",
        checkOut: filtros.checkOut || "",
        cantidadPersonas: filtros.cantidadPersonas || "0",
        cantidadHabitaciones: filtros.cantidadHabitaciones || "0",
        cantidadBaños: filtros.cantidadBaños || "0",
    });

    const [showCalendar, setShowCalendar] = useState(false);
    const [opcionesCapacidad, setOpcionesCapacidad] = useState([]);
    const [opcionesHabitaciones, setOpcionesHabitaciones] = useState([]);
    const [opcionesBaños, setOpcionesBaños] = useState([]);
    const calendarRef = useRef(null);

    const [dateRange, setDateRange] = useState([
        {
            startDate: filtros.checkIn ? parseDate(filtros.checkIn) : new Date(),
            endDate: filtros.checkOut ? parseDate(filtros.checkOut) : new Date(),
            key: "selection",
        },
    ]);

    const handleSelect = (ranges) => {
        const { startDate, endDate } = ranges.selection;
        setDateRange([{ startDate, endDate, key: "selection" }]);

        const checkInFormatted = format(startDate, "dd-MM-yyyy");
        const checkOutFormatted = format(endDate, "dd-MM-yyyy");

        setFiltros((prev) => ({
            ...prev,
            checkIn: checkInFormatted,
            checkOut: checkOutFormatted,
        }));

        setFormulario((prev) => ({
            ...prev,
            checkIn: checkInFormatted,
            checkOut: checkOutFormatted,
        }));
    };

    const actualizarOpcionesDinamicas = () => {
        if (todasLasCabañas) {
            let cabañasFiltradas = todasLasCabañas;

            if (formulario.cantidadPersonas !== "0") {
                cabañasFiltradas = cabañasFiltradas.filter(
                    (c) => c.cantidadPersonas === parseInt(formulario.cantidadPersonas)
                );
            }

            const nuevasHabitaciones = [...new Set(cabañasFiltradas.map((c) => c.cantidadHabitaciones))];
            const nuevosBaños = [...new Set(cabañasFiltradas.map((c) => c.cantidadBaños))];

            setOpcionesHabitaciones(nuevasHabitaciones.sort((a, b) => a - b));
            setOpcionesBaños(nuevosBaños.sort((a, b) => a - b));
        }
    };

    const manejarCambios = (e) => {
        const { name, value } = e.target;
        cambiado(e);

        setFiltros((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "cantidadPersonas" && value === "0") {
            const habitaciones = [...new Set(todasLasCabañas.map((c) => c.cantidadHabitaciones))];
            const baños = [...new Set(todasLasCabañas.map((c) => c.cantidadBaños))];

            setOpcionesHabitaciones(habitaciones.sort((a, b) => a - b));
            setOpcionesBaños(baños.sort((a, b) => a - b));
        } else if (name === "cantidadPersonas") {
            actualizarOpcionesDinamicas();
        }
    };

    useEffect(() => {
        if (cabañas && todasLasCabañas) {
            const capacidades = [...new Set(todasLasCabañas.map((c) => c.cantidadPersonas))];
            const habitaciones = [...new Set(cabañas.map((c) => c.cantidadHabitaciones))];
            const baños = [...new Set(cabañas.map((c) => c.cantidadBaños))];

            setOpcionesCapacidad(capacidades.sort((a, b) => a - b));
            setOpcionesHabitaciones(habitaciones.sort((a, b) => a - b));
            setOpcionesBaños(baños.sort((a, b) => a - b));
        }
    }, [cabañas]);

    useEffect(() => {
        if (formulario.cantidadPersonas !== "0") {
            actualizarOpcionesDinamicas();
        }
    }, [formulario.cantidadPersonas]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full bg-white shadow-lg p-6 rounded-md">
            <form className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 w-full justify-between">
                <div className="flex flex-col w-full md:w-auto">
                    <label htmlFor="check-in" className="text-sm font-medium mb-1 mx-auto">
                        Check-in
                    </label>
                    <input
                        type="text"
                        id="check-in"
                        value={formulario.checkIn ? formulario.checkIn : "¿Cuándo?"}
                        readOnly
                        onClick={() => setShowCalendar(true)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 cursor-pointer w-full"
                    />
                </div>

                <div className="flex flex-col w-full md:w-auto">
                    <label htmlFor="check-out" className="text-sm font-medium mb-1 mx-auto">
                        Check-out
                    </label>
                    <input
                        type="text"
                        id="check-out"
                        value={formulario.checkOut ? formulario.checkOut : "¿Cuándo?"}
                        readOnly
                        onClick={() => setShowCalendar(true)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 cursor-pointer w-full"
                    />
                </div>

                {showCalendar && (
                    <div ref={calendarRef} className="absolute mt-52 mx-auto md:mt-[28rem] md:ml-14 z-50">
                        <DateRange
                            editableDateInputs={true}
                            onChange={handleSelect}
                            showDateDisplay={false}
                            moveRangeOnFirstSelection={false}
                            rangeColors={["#65a30d"]}
                            ranges={dateRange}
                            minDate={new Date()}
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                )}

                <div className="flex flex-col w-full md:w-auto">
                    <label htmlFor="cantidadPersonas" className="text-sm font-medium mb-1 mx-auto">
                        Capacidad
                    </label>
                    <select
                        name="cantidadPersonas"
                        value={formulario.cantidadPersonas}
                        onChange={manejarCambios}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 w-full"
                    >
                        <option value="0" className="hidden">{formulario.cantidadPersonas > 0 ? formulario.cantidadPersonas : "¿Cuántos?"}</option>
                        <option value="0">-</option>
                        {opcionesCapacidad.map((capacidad) => (
                            <option key={capacidad} value={capacidad}>
                                {capacidad} Personas
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col w-full md:w-auto">
                    <label htmlFor="cantidadHabitaciones" className="text-sm font-medium mb-1 mx-auto">
                        Habitaciones
                    </label>
                    <select
                        name="cantidadHabitaciones"
                        value={formulario.cantidadHabitaciones}
                        onChange={manejarCambios}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 w-full"
                    >
                        <option value="0">-</option>
                        {opcionesHabitaciones.map((habitacion) => (
                            <option key={habitacion} value={habitacion}>
                                {habitacion} Habitación(es)
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col w-full md:w-auto">
                    <label htmlFor="cantidadBaños" className="text-sm font-medium mb-1 mx-auto">
                        Baños
                    </label>
                    <select
                        name="cantidadBaños"
                        value={formulario.cantidadBaños}
                        onChange={manejarCambios}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 w-full"
                    >
                        <option value="0">-</option>
                        {opcionesBaños.map((baño) => (
                            <option key={baño} value={baño}>
                                {baño} Baño(s)
                            </option>
                        ))}
                    </select>
                </div>
            </form>
        </div>
    );
};