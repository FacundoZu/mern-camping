import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';

export const AdminActividades = () => {
    const [actividades, setActividades] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerActividades = async () => {
            let url = `${Global.url}activity/getAllActivities`;
            const { datos } = await Peticion(url, "GET", null, false, 'include');

            if (datos.success) {
                setActividades(datos.activities);
                setCargando(false);
            }
        };
        obtenerActividades();
    }, []);

    const cambiarEstado = async (id, estadoActual) => {
        let url = Global.url + `activity/cambiarEstado/${id}`;
        const nuevoEstado = estadoActual === 'Habilitado' ? 'Deshabilitado' : 'Habilitado';

        const { datos } = await Peticion(url, "PUT", { estado: nuevoEstado }, false, 'include');

        if (datos && datos.status == 'success') {
            setActividades((prevActividades) =>
                prevActividades.map((actividad) =>
                    actividad._id === id ? { ...actividad, estado: datos.activity.estado } : actividad
                )
            );
        } else {
            console.error("No se pudo actualizar el estado de la actividad");
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-screen-xl mx-auto mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Gestión de Actividades</h2>
                <Link
                    to='/admin/CrearActividad'
                    className="px-4 py-2 bg-lime-600 text-white rounded hover:bg-lime-700 transition duration-200"
                >
                    Crear Nueva Actividad
                </Link>
            </div>
            <table className="w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <thead>
                    <tr className="bg-lime-600 text-white text-left">
                        <th className="py-3 px-4">Título</th>
                        <th className="py-3 px-4">Descripción</th>
                        <th className="py-3 px-4">Imagen</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {actividades.map((actividad) => (
                        <tr key={actividad._id} className="bg-white border-b hover:bg-gray-100 transition duration-200">
                            <td className="py-3 px-4 text-gray-700">{actividad.titulo}</td>
                            <td className="py-3 px-4 text-gray-600 truncate max-w-xs">{actividad.descripcion}</td>
                            <td className="py-3 px-4 text-gray-700">
                                <img src={actividad.imagen} alt={actividad.titulo} className="w-16 h-16 object-cover rounded" />
                            </td>
                            <td className="py-3 px-4 text-gray-600">{actividad.estado}</td>
                            <td className="py-3 px-4 text-center">
                                <Link to={`/admin/EditarActividad/${actividad._id}`} className="text-lime-500 hover:text-lime-700 mr-4 transition duration-200">Editar</Link>
                                <button
                                    onClick={() => cambiarEstado(actividad._id, actividad.estado)}
                                    className={`text-white py-1 px-3 rounded ${actividad.estado === 'Habilitado'
                                        ? 'bg-red-500 hover:bg-red-700'
                                        : 'bg-green-500 hover:bg-green-700'
                                        } transition duration-200`}
                                >
                                    {actividad.estado === 'Habilitado' ? 'Deshabilitar' : 'Habilitar'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {cargando && <p className="text-center text-gray-500 mt-4">Cargando actividades...</p>}
        </div>
    );
};
