import React, { useEffect, useState } from 'react';
import { Global } from '../../../helpers/Global'; // Asegúrate de que esta ruta esté correcta.
import { Peticion } from '../../../helpers/Peticion'; // Asegúrate de que esta ruta también esté correcta.

export const Preguntas = () => {
    const [preguntas, setPreguntas] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await Peticion(Global.url + "question/getAllQuestions", "GET", null, false, 'include');

                if (response && response.datos) {
                    setPreguntas(response.datos);
                } else {
                    throw new Error('No se encontraron preguntas en la respuesta.');
                }
            } catch (err) {
                setError(err.message);
            }
        };
        fetchQuestions();
    }, []);

    return (
        <div>
            <div>
                <h2 className="text-3xl font-bold text-center mb-6">Preguntas Frecuentes</h2>
                <ul>
                    {preguntas.map((pregunta) => (
                        <li key={pregunta._id}>
                            <div className="bg-white p-6 shadow-md rounded-md">
                            <h3 className="mt-2 font-semibold text-xl">{pregunta.pregunta}</h3>
                                <p>{pregunta.respuesta}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
};
