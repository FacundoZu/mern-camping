import React from "react";
import { Link } from "react-router-dom";
import { Actividades } from "../../utils/Actividades";
import { Preguntas } from "../../utils/Preguntas";
import Mapa from "../../utils/Mapa";
import ContactForm from "../../utils/ContactForm";
import FormularioBusqueda from "../../utils/FormularioBusqueda";
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import VisitasRecientes from "../../utils/VisitasRecientes";

export const Home = () => {
    return (
        <div className="overflow-x-hidden">
            <div className="relative h-[40rem] flex  justify-center bg-black/25 border-b-8 border-lime-700">
                <img
                    src="https://images.unsplash.com/photo-1500785685164-2ed63ba5d58d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Imagen principal"
                    className=" bottom-0 left-0 w-full h-full object-cover overflow-hidden z-[-1]"
                    style={{ position: "fixed" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="relative z-10 text-center">
                    <FormularioBusqueda />
                </div>
                <Link
                    to="/cabañas"
                    className="mt-4 z-10 absolute flex items-center px-6 py-3 bottom-5 right-5 bg-lime-600 text-white text-lg rounded-md shadow-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                >
                    Ver todas las cabañas <IoArrowForwardCircleSharp className="text-lime-400 ml-2 h-6 w-6" />
                </Link>
            </div>

            <section>
                <VisitasRecientes />
            </section>

            <section className="p-4 bg-gradient-to-b from-lime-700 to-lime-900 w-full ">
                <Actividades />
            </section>

            <section className="py-14 px-20 bg-gray-100 w-full">
                <Preguntas />
            </section>

            <section className="w-full">
                <Mapa />
            </section>

            <section id="contact-form" className="p-14 bg-gray-100 w-full">
                <ContactForm />
            </section>
        </div>
    );
};
