import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';

export const AdminEditarActividad = () => {
    const { id } = useParams();
    const [titulo, setTitulo] = useState("");
    const [imagen, setImagen] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerActividad = async () => {
            const url = `${Global.url}activity/getActivity/${id}`;
            const { datos } = await Peticion(url, "GET", null, false, 'include');
            if (datos.success) {
                setTitulo(datos.activity.titulo);
                setImagen(datos.activity.imagen);
                setDescripcion(datos.activity.descripcion);
                setFechaInicio(datos.activity.fechaInicio);
                setFechaFinal(datos.activity.fechaFinal);
            } else {
                alert("Actividad no encontrada");
                navigate("/admin/actividades");
            }
        };
        obtenerActividad();
    }, [id, navigate]);

    const actualizarActividad = async (e) => {
        e.preventDefault();
        const datosActividad = { titulo, imagen, descripcion, fechaInicio, fechaFinal };
        const url = `${Global.url}activity/updateActivity/${id}`;
        const { datos } = await Peticion(url, "PUT", datosActividad);

        if (datos.success) {
            alert("Actividad actualizada exitosamente");
            navigate("/admin/actividades");
        } else {
            alert("Error al actualizar la actividad: " + datos.mensaje);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-screen-md mx-auto mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Editar Actividad</h2>
            <form onSubmit={actualizarActividad}>
                <div className="mb-4">
                    <label className="block text-gray-700">Título</label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Imagen (URL)</label>
                    <input
                        type="text"
                        value={imagen}
                        onChange={(e) => setImagen(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Descripción</label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Fecha de Inicio</label>
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Fecha de Finalización</label>
                    <input
                        type="date"
                        value={fechaFinal}
                        onChange={(e) => setFechaFinal(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-lime-600 text-white p-2 rounded hover:bg-lime-700 transition duration-200">
                    Actualizar Actividad
                </button>
            </form>
        </div>
    );
};
