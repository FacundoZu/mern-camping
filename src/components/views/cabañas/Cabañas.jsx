import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Buscador } from "./Buscador";
import { ListadoCabañas } from "./ListadoCabañas";
import { Global } from "../../../helpers/Global";
import { Peticion } from "../../../helpers/Peticion";

export const Cabañas = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [cabañas, setCabañas] = useState([]);
    const [todasLasCabañas, setTodasLasCabañas] = useState([]);
    const [cargando, setCargando] = useState(true);

    const obtenerFiltroDesdeUrl = (param, defaultValue = "") =>
        searchParams.get(param) || defaultValue;

    const [filtros, setFiltros] = useState({
        checkIn: obtenerFiltroDesdeUrl("checkIn"),
        checkOut: obtenerFiltroDesdeUrl("checkOut"),
        cantidadPersonas: obtenerFiltroDesdeUrl("cantidadPersonas", "0"),
        cantidadHabitaciones: obtenerFiltroDesdeUrl("cantidadHabitaciones", "0"),
        cantidadBaños: obtenerFiltroDesdeUrl("cantidadBaños", "0"),
        servicios: obtenerFiltroDesdeUrl("servicios"),
    });

    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        navigate(`?${params.toString()}`, { replace: true });
    }, [filtros, navigate]);

    const obtenerCabañas = async () => {
        let url = Global.url + "cabin/getCabins";
        const { datos } = await Peticion(url, "GET", filtros, true, "include");

        if (datos && datos.cabins) {
            const cabañasConRatings = await Promise.all(
                datos.cabins.map(async (cabaña) => {
                    try {
                        if (cabaña.comentarios.length > 0 && cabaña.estado == 'Disponible') {
                            const reviewsUrl = `${Global.url}reviews/getReviewsByCabin/${cabaña._id}`;
                            const reviewsResponse = await Peticion(reviewsUrl, "GET", "", false, "include");

                            const reviews = reviewsResponse?.datos.reviews || [];
                            const ratings = reviews
                                .map((review) => Number(review.rating))
                                .filter((rating) => !isNaN(rating));

                            const promedioRating =
                                ratings.length > 0
                                    ? ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length
                                    : 0;

                            return { ...cabaña, promedioRating: parseFloat(promedioRating.toFixed(2)), reviews };
                        } else {
                            return { ...cabaña, promedioRating: 0 };
                        }
                    } catch (error) {
                        return { ...cabaña, promedioRating: 0 };
                    }
                })
            );
            const cabañasFiltradas = cabañasConRatings.filter(cabaña => cabaña.estado == 'Disponible');
            setCabañas(cabañasFiltradas);
            setCargando(false);
        }
    };

    const obtenerTodasLasCabañas = async () => {
        let url = Global.url + "cabin/getCabins";
        const { datos } = await Peticion(url, "GET", null, false);
        if (datos && datos.cabins) {
            setTodasLasCabañas(datos.cabins);
        }
    };

    useEffect(() => {
        obtenerCabañas();
    }, [filtros.checkIn, filtros.checkOut, filtros]);

    useEffect(() => {
        obtenerTodasLasCabañas();
    }, []);

    return (
        <div className={`flex flex-col mt-10 w-full px-4`}>
            <div className={`w-5/6 m-auto mb-6 lg:mb-0 lg:block`}>
                <Buscador setFiltros={setFiltros} filtros={filtros} todasLasCabañas={todasLasCabañas} cabañas={cabañas} />
            </div>

            <div className="w-5/6 m-auto min-h-screen">
                <ListadoCabañas cabañas={cabañas} cargando={cargando} checkIn={filtros.checkIn} checkOut={filtros.checkOut} />
            </div>
        </div>
    );
};