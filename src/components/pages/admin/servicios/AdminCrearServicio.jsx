import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';

export const AdminCrearServicio = () => {
    const [nombre, setNombre] = useState("");
    const [imagen, setImagen] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const navigate = useNavigate();

    const crearServicio = async (e) => {
        e.preventDefault();
        const datosServicio = { nombre, imagen, descripcion };
        const url = `${Global.url}service/create`;
        const { datos } = await Peticion(url, "POST", datosServicio, true, 'include');

        if (datos.success) {
            alert("Servicio creado exitosamente");
            navigate("/admin/servicios");
        } else {
            alert("Error al crear el servicio: " + datos.mensaje);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-screen-md mx-auto mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Crear Nuevo Servicio</h2>
            <form onSubmit={crearServicio}>
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
                    Crear Servicio
                </button>
            </form>
        </div>
    );
};
