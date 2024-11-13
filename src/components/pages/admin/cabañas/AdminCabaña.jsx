import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';

export const AdminCabaña = () => {
    const [cabañas, setCabañas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const todasLasCabañas = async () => {
            let url = Global.url + "cabin/getCabins";
            const { datos, cargando } = await Peticion(url, "GET", '', false, 'include');
            if (datos) {
                setCabañas(datos.cabins);
                setCargando(false);
            }
        };
        todasLasCabañas();
    }, []);

    const cambiarEstado = async (id, estado) => {
        let url = Global.url + `cabin/cambiarEstado/${id}`;

        const { datos } = await Peticion(url, "PUT", {estado: estado}, false, 'include');

        if (datos) {
            setCabañas((prevCabañas) =>
                prevCabañas.map((cabaña) =>
                    cabaña._id === id ? { ...cabaña, estado: datos.cabin.estado } : cabaña
                )
            );
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-screen-xl mx-auto mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Gestión de Cabañas</h2>
                <Link
                    to='/admin/CrearCabaña'
                    className="px-4 py-2 bg-lime-600 text-white rounded hover:bg-lime-700 transition duration-200"
                >
                    Crear Nueva Cabaña
                </Link>
            </div>
            <table className="w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <thead>
                    <tr className="bg-lime-600 text-white text-left">
                        <th className="py-3 px-4">Nombre</th>
                        <th className="py-3 px-4">Descripción</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cabañas.map((cabaña) => (
                        <tr
                            key={cabaña._id}
                            className={`border-b hover:bg-gray-100 transition duration-200 ${cabaña.estado != 'Disponible' ? 'bg-gray-200' : 'bg-white'} `}
                        >
                            <td className="py-3 px-4 text-gray-700">{cabaña.nombre}</td>
                            <td className="py-3 px-4 text-gray-600 truncate max-w-xs">{cabaña.descripcion}</td>
                            <td className="py-3 px-4 text-gray-700">{cabaña.estado}</td>
                            <td className="py-3 px-4 text-center">
                                <Link
                                    to={`/admin/EditarCabaña/${cabaña._id}`}
                                    className="text-lime-500 hover:text-lime-700 mr-4 transition duration-200"
                                >
                                    Editar
                                </Link>
                                <button
                                    onClick={() => cabaña.estado != 'Disponible' ? cambiarEstado(cabaña._id, 'No Disponible') : cambiarEstado(cabaña._id, 'Disponible')}
                                    className={`text-white py-1 px-3 rounded ${cabaña.estado === 'Disponible'
                                            ? 'bg-red-500 hover:bg-red-700'
                                            : 'bg-green-500 hover:bg-green-700'
                                        } transition duration-200`}
                                >
                                    {cabaña.estado === 'Disponible' ? 'Deshabilitar' : 'Habilitar'}
                                </button>
                                <Link to={`/cabaña/${cabaña._id}`} className='text-blue-500 hover:text-blue-700 ml-4 transition duration-200'>Ver</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {cargando && <p className="text-center text-gray-500 mt-4">Cargando cabañas...</p>}
        </div>
    );
};
