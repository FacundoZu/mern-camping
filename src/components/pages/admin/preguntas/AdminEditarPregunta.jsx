import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';

export const AdminEditarPregunta = () => {
    const { id } = useParams(); // Obtén el ID de la pregunta desde la URL
    const [pregunta, setPregunta] = useState("");
    const [respuesta, setRespuesta] = useState("");
    const [estado, setEstado] = useState("Deshabilitado");
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerPregunta = async () => {
            const url = `${Global.url}question/getQuestion/${id}`;  // Asegúrate de que la URL sea la correcta
            const { datos } = await Peticion(url, "GET", null, false, 'include');
            
            if (datos.success) {
                setPregunta(datos.question.pregunta);
                setRespuesta(datos.question.respuesta);
                setEstado(datos.question.estado);
            } else {
                alert("Pregunta no encontrada");
                navigate("/admin/preguntas");
            }
        };
        obtenerPregunta();
    }, [id, navigate]);

    const actualizarPregunta = async (e) => {
        e.preventDefault();
        const datosPregunta = { pregunta, respuesta, estado };
        const url = `${Global.url}question/updateQuestion/${id}`;
        const { datos } = await Peticion(url, "PUT", datosPregunta);

        if (datos.success) {
            alert("Pregunta actualizada exitosamente");
            navigate("/admin/preguntas");
        } else {
            alert("Error al actualizar la pregunta: " + datos.mensaje);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-screen-md mx-auto mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Editar Pregunta</h2>
            <form onSubmit={actualizarPregunta}>
                <div className="mb-4">
                    <label className="block text-gray-700">Pregunta</label>
                    <input
                        type="text"
                        value={pregunta}
                        onChange={(e) => setPregunta(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Respuesta</label>
                    <textarea
                        value={respuesta}
                        onChange={(e) => setRespuesta(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Estado</label>
                    <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    >
                        <option value="Habilitado">Habilitado</option>
                        <option value="Deshabilitado">Deshabilitado</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-lime-600 text-white p-2 rounded hover:bg-lime-700 transition duration-200">
                    Actualizar Pregunta
                </button>
            </form>
        </div>
    );
};
