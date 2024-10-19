import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Semana empieza el lunes
  getDay,
  locales,
});

const CalendarioReservasBig = ({ reservas }) => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const obtenerEventos = () => {
      const eventosFormateados = reservas.map((reserva) => ({
        title: 'Reservado',
        start: new Date(reserva.start),
        end: new Date(reserva.end),
        allDay: true,
      }));
      setEventos(eventosFormateados);
    };

    obtenerEventos();
  }, [reservas]);

  return (
    <div className="container  mx-auto p-6 w-full h-[500px] lg:h-[600px] md:h-[500px] sm:h-[400px] 
            xs:h-[350px] rounded-lg text-sm md:text-base lg:text-lg xl:text-xl">
      <h2 className="text-3xl font-bold text-center mb-6">Calendario de Reservas</h2>
      <div className="bg-white rounded-lg p-4 ">
        <Calendar
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
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
        />
      </div>
    </div>
  );
};

export default CalendarioReservasBig;
