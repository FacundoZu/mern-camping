import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';

export const AdminServicios = () => {
    const [servicios, setServicios] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerServicios = async () => {
            let url = `${Global.url}service/getAllServices`;
            const { datos } = await Peticion(url, "GET", null, false, 'include');

            if (datos.success) {
                setServicios(datos.services);
                setCargando(false);
            }
        };
        obtenerServicios();
    }, []);

    const cambiarEstado = async (id, estadoActual) => {
        let url = Global.url + `service/cambiarEstado/${id}`;

        const nuevoEstado = estadoActual === 'Habilitado' ? 'Deshabilitado' : 'Habilitado';

        const { datos } = await Peticion(url, "PUT", { estado: nuevoEstado }, false, 'include');

        if (datos && datos.status === 'success') {
            setServicios((prevServicios) =>
                prevServicios.map((servicio) =>
                    servicio._id === id ? { ...servicio, estado: datos.service.estado } : servicio
                )
            );
        } else {
            console.error("No se pudo actualizar el estado del servicio");
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Gestión de Servicios</h2>
                <Link
                    to='/admin/CrearServicio'
                    className="px-4 py-2 bg-lime-600 text-white rounded hover:bg-lime-700 transition duration-200"
                >
                    Crear Nuevo Servicio
                </Link>
            </div>
            <table className="w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <thead>
                    <tr className="bg-lime-600 text-white text-left">
                        <th className="py-3 px-4">Nombre</th>
                        <th className="py-3 px-4">Descripción</th>
                        <th className="py-3 px-4">Imagen</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {servicios.map((servicio) => (
                        <tr key={servicio._id} className="bg-white border-b hover:bg-gray-100 transition duration-200">
                            <td className="py-3 px-4 text-gray-700">{servicio.nombre}</td>
                            <td className="py-3 px-4 text-gray-600 truncate max-w-xs">{servicio.descripcion}</td>
                            <td className="py-3 px-4 text-gray-700">
                                <img src={servicio.imagen} alt={servicio.nombre} className="w-16 h-16 object-cover rounded" />
                            </td>
                            <td className="py-3 px-4 text-gray-600 truncate max-w-xs">{servicio.estado}</td>
                            <td className="py-3 px-4 text-center">
                                <Link to={`/admin/EditarServicio/${servicio._id}`} className="text-lime-500 hover:text-lime-700 mr-4 transition duration-200">Editar</Link>
                                <button
                                    onClick={() => servicio.estado != 'Habilitado' ? cambiarEstado(servicio._id, 'Deshabilitado') : cambiarEstado(servicio._id, 'Habilitado')}
                                    className={`text-white py-1 px-3 rounded ${servicio.estado === 'Habilitado'
                                        ? 'bg-red-500 hover:bg-red-700'
                                        : 'bg-green-500 hover:bg-green-700'
                                        } transition duration-200`}
                                >
                                    {servicio.estado === 'Habilitado' ? 'Deshabilitar' : 'Habilitar'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {cargando && <p className="text-center text-gray-500 mt-4">Cargando servicios...</p>}
        </div>
    );
};
