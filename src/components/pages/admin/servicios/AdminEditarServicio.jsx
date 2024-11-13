import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';

export const AdminEditarServicio = () => {
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [imagen, setImagen] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerServicio = async () => {
            const url = `${Global.url}service/getService/${id}`;
            const { datos } = await Peticion(url, "GET", null, false, 'include');
            if (datos.success) {
                setNombre(datos.service.nombre);
                setImagen(datos.service.imagen);
                setDescripcion(datos.service.descripcion);
            } else {
                alert("Servicio no encontrado");
                navigate("/admin/servicios");
            }
        };
        obtenerServicio();
    }, [id, navigate]);

    const actualizarServicio = async (e) => {
        e.preventDefault();
        const datosServicio = { nombre, imagen, descripcion };
        const url = `${Global.url}service/update/${id}`;
        const { datos } = await Peticion(url, "PUT", datosServicio);

        if (datos.success) {
            alert("Servicio actualizado exitosamente");
            navigate("/admin/servicios");
        } else {
            alert("Error al actualizar el servicio: " + datos.mensaje);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-screen-md mx-auto mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Editar Servicio</h2>
            <form onSubmit={actualizarServicio}>
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
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
                <button type="submit" className="w-full bg-lime-600 text-white p-2 rounded hover:bg-lime-700 transition duration-200">
                    Actualizar Servicio
                </button>
            </form>
        </div>
    );
};
