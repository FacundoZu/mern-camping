import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import Modal from './Modal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useAuth from '../../../../hooks/useAuth';

const locales = {
  es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const ErrorMessage = ({ message }) => (
  <div className="bg-red-500 text-white p-3 rounded mb-4">
    {message}
  </div>
);

export const CalendarioReservas = ({ reservas, onReservar, mensajeError, userId, onClose }) => {
  const [eventos, setEventos] = useState([]);
  const [fechaInicioSeleccionada, setFechaInicioSeleccionada] = useState(null);
  const [fechaFinSeleccionada, setFechaFinSeleccionada] = useState(null);
  const { auth } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

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
  }, [reservas, userId]);

  const eventStyleGetter = (event) => {
    const backgroundColor = event.isUserReservation ? '#65a30d' : '#475569';
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return {
      style,
    };
  };

  const handleSelectSlot = ({ start, end }) => {
    setFechaInicioSeleccionada(start);
    setFechaFinSeleccionada(end);
  };

  const handleReservar = async () => {
    if (fechaInicioSeleccionada && fechaFinSeleccionada) {
      const response = await onReservar({
        fechaInicio: fechaInicioSeleccionada.toISOString(),
        fechaFinal: fechaFinSeleccionada.toISOString(),
      });

      console.log(response)
      if (response.datos?.status == "success") {
        setModalTitle('Reserva Exitosa');
        setModalMessage('Tu reserva se ha realizado con éxito!');
        setIsModalOpen(true);
        setFechaInicioSeleccionada(null);
        setFechaFinSeleccionada(null);
      }
    }
  };

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
            selectable={true}
            onSelectSlot={handleSelectSlot}
            views={['month']}
            defaultView="month"
            culture="es"
            messages={{
              next: "Sig",
              previous: "Ant",
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              agenda: "Agenda",
              date: "Fecha",
              time: "Hora",
              event: "Evento",
              noEventsInRange: "No hay eventos en este rango.",
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
                  {fechaInicioSeleccionada.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </p>
              <p className="font-semibold text-lime-800 mt-2">
                Fecha de fin:
                <span className="font-normal text-lime-600">
                  {fechaFinSeleccionada.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-lg text-gray-700">Selecciona un rango de fechas para hacer la reserva.</p>
          )}

          {mensajeError && <ErrorMessage message={mensajeError} />}

          <button onClick={handleReservar} className="mt-4 bg-lime-500 text-white py-3 px-6 rounded-lg hover:bg-lime-600">
            Reservar
          </button>
          {onClose && (<button onClick={onClose} className="mt-4 bg-lime-500 text-white py-3 px-6 rounded-lg hover:bg-lime-600 ml-10">
            Cerrar
          </button>
          )}

        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
      />
    </div>
  );
};
