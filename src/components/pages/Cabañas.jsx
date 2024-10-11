import React, { useState } from 'react';
import { Buscador } from './Buscador';
import { ListadoCabañas } from './ListadoCabañas';
import { FaFilter } from "react-icons/fa";

export const Cabañas = () => {
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [filtros, setFiltros] = useState({
        descripcion: "",
        cantidadPersonas: "0",
        cantidadHabitaciones: "0",
        cantidadBaños: "0"
    });

    const toggleFiltros = () => {
        setMostrarFiltros(!mostrarFiltros);
    };

    return (
        <div className={`flex lg:flex-row lg:space-x-6 mt-10 w-full px-4 ${mostrarFiltros ? 'flex-col' : 'flex'}`}>
            <div className='lg:hidden mb-4 text-center'>
                <button className={`bg-lime-600 text-white p-2 rounded-md shadow-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 ${mostrarFiltros ? 'block w-full' : 'flex'}`} onClick={toggleFiltros}>
                    {mostrarFiltros ? 'Ocultar Filtros' : <FaFilter />}
                </button>
            </div>

            <div className={`w-full lg:w-1/3 mb-6 lg:mb-0 ${mostrarFiltros ? 'block' : 'hidden'} lg:block`}>
                <Buscador setFiltros={setFiltros} />
            </div>

            <div className='w-full lg:w-2/3 flex flex-col'>
                <ListadoCabañas filtros={filtros} />
            </div>
        </div>
    );
};
