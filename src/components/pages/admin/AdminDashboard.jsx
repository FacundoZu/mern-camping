import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Global } from '../../../helpers/Global';
import { Peticion } from '../../../helpers/Peticion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const AdminDashboard = () => {
  const [estadisticas, setEstadisticas] = useState({
    cabañasDisponibles: 0,
    reservasTotales: 0,
  });
  const [cabañas, setCabañas] = useState([]);
  const [reservasMensuales, setReservasMensuales] = useState(new Array(12).fill(0));
  const [reservasPorCabaña, setReservasPorCabaña] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      let urlCabañas = Global.url + "cabin/getCabins";
      const { datos: cabañasData } = await Peticion(urlCabañas, "GET", '', false, 'include');
      setCabañas(cabañasData.cabins);

      let urlReservas = Global.url + "reservation/getAllReservations";
      const { datos: reservasData } = await Peticion(urlReservas, "GET", '', false, 'include');

      const cabañasDisponibles = cabañasData.cabins.filter(cabaña => cabaña.estado === 'Disponible').length;
      const reservasTotales = reservasData.reservations.length;

      const reservasPorMes = new Array(12).fill(0);
      const reservasCountPorCabaña = {};

      cabañasData.cabins.forEach(cabaña => {
        reservasCountPorCabaña[cabaña._id] = 0;
      });

      reservasData.reservations.forEach(reserva => {
        const fechaReserva = new Date(reserva.fechaInicio);
        const mes = fechaReserva.getMonth();
        reservasPorMes[mes]++;

        const cabañaId = reserva.cabaniaId ? reserva.cabaniaId._id : null;

        if (cabañaId && reservasCountPorCabaña[cabañaId] !== undefined) {
          reservasCountPorCabaña[cabañaId]++;
        }
      });

      const reservasPorCabañaData = cabañasData.cabins.map(cabaña => reservasCountPorCabaña[cabaña._id]);
      setReservasPorCabaña(reservasPorCabañaData);
      setEstadisticas({ cabañasDisponibles, reservasTotales });
      setReservasMensuales(reservasPorMes);
    };

    obtenerDatos();
  }, []);

  const dataReservasMensuales = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        label: 'Reservas Mensuales',
        data: reservasMensuales,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.1,
      },
    ],
  };

  const dataCabañasEstado = {
    labels: ['Disponible', 'No Disponible'],
    datasets: [
      {
        label: 'Cabañas por Estado',
        data: [estadisticas.cabañasDisponibles, cabañas.length - estadisticas.cabañasDisponibles],
        backgroundColor: ['rgba(75,192,192,0.2)', 'rgba(255,99,132,0.2)'],
        borderColor: ['rgba(75,192,192,1)', 'rgba(255,99,132,1)'],
        borderWidth: 1,
      },
    ],
  };

  const dataReservasPorCabaña = {
    labels: cabañas.map(cabaña => cabaña.nombre),
    datasets: [
      {
        label: 'Reservas por Cabaña',
        data: reservasPorCabaña,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56',
          '#C9DE00', '#D8A48F', '#AF7AC5', '#F1948A', '#5DADE2'
        ],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const opcionesGrafico = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };



  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Bienvenido al Dashboard</h1>
      <p>Esta es la página principal de administración.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-lime-600 p-4 text-white rounded shadow-lg text-center">
          <h3 className="text-lg font-semibold">Cabañas Disponibles</h3>
          <p className="text-3xl">{estadisticas.cabañasDisponibles}</p>
        </div>
        <div className="bg-blue-600 p-4 text-white rounded shadow-lg text-center">
          <h3 className="text-lg font-semibold">Reservas Totales</h3>
          <p className="text-3xl">{estadisticas.reservasTotales}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Gráfico de Reservas Mensuales</h3>
        <div style={{ height: '300px' }}>
          <Line data={dataReservasMensuales} options={opcionesGrafico} />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Gráfico de Cabañas por Estado</h3>
        <div style={{ height: '300px' }}>
          <Bar data={dataCabañasEstado} options={opcionesGrafico} />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Gráfico de Reservas por Cabaña</h3>
        <div style={{ height: '300px' }}>
          {cabañas.length > 0 && reservasPorCabaña.length > 0 ? (
            <Pie data={dataReservasPorCabaña} options={opcionesGrafico} />
          ) : (
            <p>Cargando datos...</p>
          )}
        </div>
      </div>
    </div>
  );
};
