import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isWithinInterval, isBefore, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useAuth from '../../../../hooks/useAuth';
import { Link } from 'react-router-dom';

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const ErrorMessage = ({ message }) => (
  <div className="bg-red-500 opacity-80 text-white p-3 rounded mb-4">
    {message}
  </div>
);

export const CalendarioReservas = ({ reservas, onReservar, mensajeError, onClose, precioPorNoche }) => {
  const [eventos, setEventos] = useState([]);
  const [fechaInicioSeleccionada, setFechaInicioSeleccionada] = useState(null);
  const [fechaFinSeleccionada, setFechaFinSeleccionada] = useState(null);
  const [mensajeConflicto, setMensajeConflicto] = useState('');
  const { auth } = useAuth();

  useEffect(() => {
    const obtenerEventos = () => {
      if (!reservas || reservas.length === 0) {
        setEventos([]);
        return;
      }

      const eventosFormateados = reservas.map((reserva) => ({
        title: auth ? (reserva.usuarioId === auth.id ? 'Tu reserva' : 'Reservado') : 'Reservado',
        start: new Date(reserva.fechaInicio),
        end: new Date(reserva.fechaFinal),
        allDay: true,
        isUserReservation: auth ? (reserva.usuarioId === auth.id) : null,
      }));

      setEventos(eventosFormateados);
    };

    obtenerEventos();
  }, [reservas, auth]);

  const eventStyleGetter = (event) => {
    const backgroundColor = event.isTemporary
      ? '#ffa500'
      : event.isUserReservation
        ? '#65a30d'
        : '#475569';
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return { style };
  };

  const handleSelectSlot = ({ start, end }) => {
    if (!auth) {
      setMensajeConflicto('Debes iniciar sesión para seleccionar fechas.');
      return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isBefore(start, hoy)) {
      setMensajeConflicto('No puedes seleccionar fechas anteriores al día de hoy.');
      return;
    }

    const adjustedEnd = new Date(end);
    setFechaInicioSeleccionada(start);
    setFechaFinSeleccionada(adjustedEnd);

    const hayConflicto = Array.isArray(reservas) && reservas.length > 0
      ? reservas.some((reserva) => {
        const reservaInicio = new Date(reserva.fechaInicio);
        const reservaFin = new Date(reserva.fechaFinal);
        return (
          isWithinInterval(start, { start: reservaInicio, end: reservaFin }) ||
          isWithinInterval(adjustedEnd, { start: reservaInicio, end: reservaFin }) ||
          (start <= reservaInicio && adjustedEnd >= reservaFin)
        );
      })
      : false;

    if (hayConflicto) {
      setMensajeConflicto('Las fechas seleccionadas se superponen con una reserva existente.');
    } else {
      setMensajeConflicto('');
    }

    const eventoTemporal = {
      title: 'Reserva seleccionada',
      start,
      end: adjustedEnd,
      allDay: true,
      isUserReservation: true,
      isTemporary: true,
    };

    setEventos((prevEventos) => [
      ...prevEventos.filter((event) => event.title !== 'Reserva seleccionada'),
      eventoTemporal,
    ]);
  };

  const handleReservar = async () => {
    if (fechaInicioSeleccionada && fechaFinSeleccionada) {
      const response = await onReservar({
        fechaInicio: fechaInicioSeleccionada.toISOString(),
        fechaFinal: fechaFinSeleccionada.toISOString(),
      });
      if (response.datos?.status === 'success') {
        setFechaInicioSeleccionada(null);
        setFechaFinSeleccionada(null);
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
        <div className="h-[500px] lg:h-[600px] md:h-[500px] sm:h-[400px] xs:h-[350px]">
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            selectable={!!auth}
            onSelectSlot={handleSelectSlot}
            views={['month']}
            defaultView="month"
            culture="es"
            messages={{
              next: 'Sig',
              previous: 'Ant',
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              agenda: 'Agenda',
              date: 'Fecha',
              time: 'Hora',
              event: 'Evento',
              noEventsInRange: 'No hay eventos en este rango.',
            }}
            eventPropGetter={eventStyleGetter}
          />
        </div>
        <div className="mt-6 text-center">
          {fechaInicioSeleccionada && fechaFinSeleccionada ? (
            <div className="mb-4 p-6 border border-lime-300 bg-lime-50 rounded-lg shadow-md">
              <p className="font-semibold text-lime-800">
                Fecha de inicio:
                <span className="font-normal text-lime-600">
                  {' '}
                  {fechaInicioSeleccionada.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                . Todo el día.
              </p>
              <p className="font-semibold text-lime-800 mt-2">
                Fecha de fin:
                <span className="font-normal text-lime-600">
                  {' '}
                  {fechaFinSeleccionada.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                . A las 10:00 AM.
              </p>
              <p className="font-semibold text-lime-800 mt-2">
                Precio total:
                <span className="font-normal text-lime-600"> ${precioTotal.toFixed(2)}</span>
              </p>
            </div>
          ) : (
            <p className="text-lg text-gray-700">Selecciona un rango de fechas para hacer la reserva.</p>
          )}

          {mensajeConflicto && <ErrorMessage message={mensajeConflicto} />}
          {mensajeError && <ErrorMessage message={mensajeError} />}

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
              className={`mt-4 py-3 px-6 rounded-lg ${mensajeConflicto || mensajeError
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-lime-500 hover:bg-lime-600'
                } text-white`}
              disabled={mensajeConflicto || mensajeError}
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
