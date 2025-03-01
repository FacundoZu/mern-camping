import React, { useEffect, useState } from "react";
import { Buscador } from "./Buscador";
import { ListadoCabañas } from "./ListadoCabañas";
import { FaFilter } from "react-icons/fa";
import { Global } from "../../../helpers/Global";
import { Peticion } from "../../../helpers/Peticion";

export const Cabañas = () => {
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [cabañas, setCabañas] = useState([]);
    const [todasLasCabañas, setTodasLasCabañas] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [filtros, setFiltros] = useState({
        descripcion: "",
        cantidadPersonas: "0",
        cantidadHabitaciones: "0",
        cantidadBaños: "0",
        servicios: "",
    });

    const obtenerCabañas = async () => {
        let url = Global.url + "cabin/getCabins";
        const { datos } = await Peticion(url, "GET", null, false, "include");
    
        if (datos && datos.cabins) {
            const cabañasConRatings = await Promise.all(
                datos.cabins.map(async (cabaña) => {
                    try {
                        const reviewsUrl = `${Global.url}reviews/getReviewsByCabin/${cabaña._id}`;
                        const reviewsResponse = await Peticion(reviewsUrl, "GET", null, false, "include");

                        const reviews = reviewsResponse?.datos.reviews || []; 
                        const ratings = reviews
                            .map((review) => Number(review.rating))
                            .filter((rating) => !isNaN(rating));
    
                        const promedioRating =
                            ratings.length > 0
                                ? ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length
                                : 0;
    
                        return { ...cabaña, promedioRating: parseFloat(promedioRating.toFixed(2)), reviews };
                    } catch (error) {
                        console.error(`Error al obtener reviews para la cabaña ${cabaña._id}:`, error);
                        return { ...cabaña, promedioRating: 0 };
                    }
                })
            );
    
            setCabañas(cabañasConRatings);
            setTodasLasCabañas(cabañasConRatings);
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerCabañas();
    }, []);

    const aplicarFiltros = () => {
        let cabañasFiltradas = todasLasCabañas;

        if (filtros.descripcion) {
            cabañasFiltradas = cabañasFiltradas.filter((c) =>
                c.descripcion.toLowerCase().includes(filtros.descripcion.toLowerCase())
            );
        }
        if (filtros.cantidadPersonas !== "0") {
            cabañasFiltradas = cabañasFiltradas.filter(
                (c) => c.cantidadPersonas === parseInt(filtros.cantidadPersonas)
            );
        }
        if (filtros.cantidadHabitaciones !== "0") {
            cabañasFiltradas = cabañasFiltradas.filter(
                (c) => c.cantidadHabitaciones === parseInt(filtros.cantidadHabitaciones)
            );
        }
        if (filtros.cantidadBaños !== "0") {
            cabañasFiltradas = cabañasFiltradas.filter((c) => c.cantidadBaños === parseInt(filtros.cantidadBaños));
        }

        setCabañas(cabañasFiltradas);
    };

    useEffect(() => {
        aplicarFiltros();
    }, [filtros, todasLasCabañas]);

    const toggleFiltros = () => {
        setMostrarFiltros(!mostrarFiltros);
    };

    return (
        <div
            className={`flex flex-col lg:flex-row lg:space-x-6 mt-10 w-full px-4 ${mostrarFiltros ? "flex-col" : "flex"
                }`}
        >
            <div className="lg:hidden mb-4 text-center">
                <button
                    className={`flex items-center justify-center space-x-2 m-auto bg-lime-600 text-white p-3 rounded-md shadow-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all duration-300 w-full max-w-xs`}
                    onClick={toggleFiltros}
                >
                    {mostrarFiltros ? (
                        <p className="font-semibold w-full text-center">Ocultar Filtros</p>
                    ) : (
                        <div className="w-full">
                            <p className=" flex font-semibold w-full text-center items-center justify-center gap-2">
                                {" "}
                                <FaFilter /> Mostrar filtros
                            </p>
                        </div>
                    )}
                </button>
            </div>

            <div className={`w-full lg:w-1/4 mb-6 lg:mb-0 ${mostrarFiltros ? "block" : "hidden"} lg:block`}>
                <Buscador setFiltros={setFiltros} cabañas={todasLasCabañas} />
            </div>

            <div className="w-full lg:w-3/4 flex flex-col">
                <ListadoCabañas cabañas={cabañas} cargando={cargando} />
            </div>
        </div>
    );
};
