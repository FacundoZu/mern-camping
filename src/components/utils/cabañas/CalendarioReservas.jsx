import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { es } from "date-fns/locale";
import { addDays, isBefore, isWithinInterval, parse } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export const CalendarioReservas = ({ reservas, onReservar, onClose, precioPorNoche, checkIn, checkOut }) => {
  const [fechaInicioSeleccionada, setFechaInicioSeleccionada] = useState(null);
  const [fechaFinSeleccionada, setFechaFinSeleccionada] = useState(null);
  const [hayConflicto, setHayConflicto] = useState(false);
  const { auth } = useAuth();


  const [rangoSeleccionado, setRangoSeleccionado] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    key: "selection",
  });

  const parseDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      throw new Error("Fecha no válida");
    }

    return parse(dateString, "dd-MM-yyyy", new Date());
  };


  const fechasReservadas = Array.isArray(reservas)
    ? reservas.flatMap((reserva) => {
      const inicio = new Date(reserva.fechaInicio);
      const fin = new Date(reserva.fechaFinal);
      const fechas = [];
      for (let fecha = inicio; fecha <= fin; fecha.setDate(fecha.getDate() + 1)) {
        fechas.push(new Date(fecha));
      }
      return fechas;
    })
    : [];


  useEffect(() => {
    if (checkIn && checkOut) {
      const fechaInicio = parseDate(checkIn);
      const fechaFin = parseDate(checkOut);

      setFechaInicioSeleccionada(fechaInicio);
      setFechaFinSeleccionada(fechaFin);

      setRangoSeleccionado({
        startDate: fechaInicio,
        endDate: fechaFin,
        key: "selection",
      });
    }
  }, [checkIn, checkOut]);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;

    if (!auth) {
      toast.error("Debes iniciar sesión para seleccionar fechas.");
      return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isBefore(startDate, hoy)) {
      toast.error("No puedes seleccionar fechas anteriores al día de hoy.");
      return;
    }

    setFechaInicioSeleccionada(startDate);
    setFechaFinSeleccionada(endDate);

    const conflicto = Array.isArray(reservas) && reservas.length > 0
      ? reservas.some((reserva) => {
        const reservaInicio = new Date(reserva.fechaInicio);
        const reservaFin = new Date(reserva.fechaFinal);
        return (
          isWithinInterval(startDate, { start: reservaInicio, end: reservaFin }) ||
          isWithinInterval(endDate, { start: reservaInicio, end: reservaFin }) ||
          (startDate <= reservaInicio && endDate >= reservaFin)
        );
      })
      : false;

    setHayConflicto(conflicto);

    if (conflicto) {
      toast.error("Las fechas seleccionadas se superponen con una reserva existente.");
    }

    setRangoSeleccionado(ranges.selection);
  };

  const handleReservar = async () => {
    if (fechaInicioSeleccionada && fechaFinSeleccionada && !hayConflicto) {
      const response = await onReservar({
        fechaInicio: fechaInicioSeleccionada.toISOString(),
        fechaFinal: fechaFinSeleccionada.toISOString(),
      });
      if (response.datos?.status === "success") {
        toast.success("Reserva realizada con éxito.");
        setFechaInicioSeleccionada(null);
        setFechaFinSeleccionada(null);
        setHayConflicto(false);
      } else {
        toast.error("Error al realizar la reserva.");
      }
    }
  };

  const calcularPrecioTotal = () => {
    if (fechaInicioSeleccionada && fechaFinSeleccionada && precioPorNoche) {
      const dias = Math.ceil((fechaFinSeleccionada - fechaInicioSeleccionada) / (1000 * 60 * 60 * 24));
      return dias * precioPorNoche;
    }
    return 0;
  };

  const precioTotal = calcularPrecioTotal();

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h2 className="text-3xl font-bold text-center mb-6">Calendario de Reservas</h2>
      <div className="p-4">
        <div className="flex justify-center">
          <DateRangePicker
            ranges={[rangoSeleccionado]}
            onChange={handleSelect}
            months={2}
            direction="horizontal"
            locale={es}
            minDate={new Date()}
            rangeColors={["#65a30d"]}
            showDateDisplay={false}
            showMonthAndYearPickers={false}
            className="custom-date-range-picker"
            disabledDates={fechasReservadas}
          />
        </div>
        <div className="mt-6 text-center">
          {fechaInicioSeleccionada && fechaFinSeleccionada ? (
            <div className="mb-4 p-6 w-3/6 m-auto border border-lime-300 bg-lime-50 rounded-lg shadow-md">
              <p className="font-semibold text-lime-800">
                Fecha de inicio:
                <span className="font-normal text-lime-600">
                  {" "}
                  {fechaInicioSeleccionada.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </p>
              <p className="font-semibold text-lime-800 mt-2">
                Fecha de fin:
                <span className="font-normal text-lime-600">
                  {" "}
                  {fechaFinSeleccionada.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </p>
              <p className="font-semibold text-lime-800 mt-2">
                Precio total:
                <span className="font-normal text-lime-600"> ${precioTotal.toFixed(2)}</span>
              </p>
            </div>
          ) : (
            <p className="text-lg text-gray-700">Selecciona un rango de fechas para hacer la reserva.</p>
          )}

          {!auth ? (
            <Link
              to="/login"
              className="bg-lime-500 hover:bg-lime-700 text-white py-3 px-6 rounded-lg mt-4 inline-block"
            >
              Inicia sesión para reservar
            </Link>
          ) : (
            <button
              onClick={handleReservar}
              className={`mt-4 py-3 px-6 rounded-lg ${!fechaInicioSeleccionada || !fechaFinSeleccionada || hayConflicto
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-lime-500 hover:bg-lime-600"
                } text-white`}
              disabled={!fechaInicioSeleccionada || !fechaFinSeleccionada || hayConflicto}
            >
              Reservar
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="mt-4 bg-lime-500 text-white py-3 px-6 rounded-lg hover:bg-lime-600 ml-10"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};