import React, { useEffect, useState } from 'react';
import { Global } from '../../../helpers/Global';
import { Peticion } from '../../../helpers/Peticion';

export const Preguntas = () => {
    const [preguntas, setPreguntas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await Peticion(Global.url + "question/getAllQuestions", "GET", null, false, 'include');

                if (response && response.datos.preguntas) {
                    setPreguntas(response.datos.preguntas);
                } else {
                    throw new Error('No se encontraron preguntas en la respuesta.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    if (loading) return <p className="text-center text-gray-500">Cargando preguntas...</p>;

    return (
        <div>
            <div>
                {preguntas.length > 0 &&
                    <h2 className="text-3xl font-bold text-center mb-6">Preguntas Frecuentes</h2>
                }
                <ul>
                    {preguntas.map((pregunta) => (
                        pregunta.estado == "Habilitado" &&
                        <li key={pregunta._id}>
                            <div className="bg-white p-6 my-2 shadow-md rounded-md">
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
