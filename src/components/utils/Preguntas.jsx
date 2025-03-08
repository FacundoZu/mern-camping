import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { Peticion } from '../../helpers/Peticion';
import { FaQuestionCircle, FaCommentDots } from 'react-icons/fa';

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

    if (loading) {
        return (
            <div className="py-12">
                <div className="md:w-4/6 m-auto">
                    <div className="flex justify-center items-center mb-8">
                        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                        <div className="h-12 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
                    </div>

                    <ul className="space-y-6">
                        {[...Array(3)].map((_, index) => (
                            <li key={index}>
                                <div className="bg-white p-6 shadow-lg rounded-lg">
                                    <div className="flex items-center mb-4">
                                        <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                                        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }


    return (
        <div className="py-12 bg-pattern bg-repeat bg-center">
            <div className="md:w-4/6 m-auto">
                {preguntas.length > 0 && (
                    <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 items-center flex justify-center">
                        <FaQuestionCircle className="inline-block mr-2 text-lime-600" />
                        <p>Preguntas Frecuentes</p>
                    </h2>
                )}
                <ul className="space-y-6">
                    {preguntas.map((pregunta) => (
                        pregunta.estado == "Habilitado" && (
                            <li key={pregunta._id}>
                                <div className="bg-white p-6 shadow-lg rounded-lg transform transition-transform duration-300 hover:scale-105">
                                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                        <FaCommentDots className="text-lime-600 mr-2" />
                                        <p>{pregunta.pregunta}</p>
                                    </h3>
                                    <p className="mt-2 text-gray-600 leading-relaxed">
                                        {pregunta.respuesta}
                                    </p>
                                </div>
                            </li>
                        )
                    ))}
                </ul>
            </div>
        </div>
    );
};