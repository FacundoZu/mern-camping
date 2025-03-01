import React from "react";
import { RiLeafFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { Actividades } from "../../utils/Actividades";
import { Preguntas } from "../../utils/Preguntas";
import Mapa from "../../utils/Mapa";
import ContactForm from "../../utils/ContactForm";
import FormularioBusqueda from "../../utils/FormularioBusqueda";

export const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <div className="relative h-[40rem] flex items-center justify-center bg-black/25 border-b-8 border-lime-700">
        <img
          src="https://media.istockphoto.com/id/584589782/es/foto/tiendas-de-campa%C3%B1a-zona-de-acampada-temprano-en-la-ma%C3%B1ana-hermoso-lugar-natural.jpg?s=612x612&w=0&k=20&c=RPmP2NQWNM5GlXNXZBYmOYVh1-SdiEzWGd-RXPrCylo="
          alt="Imagen principal"
          className="absolute bottom-0 left-0 w-full object-cover z-[-1]"
          style={{ position: "fixed" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="relative z-10 text-center">
          <FormularioBusqueda />
        </div>
      </div>

      <section className="md:p-10 bg-gray-200 w-full">
        <Actividades />
      </section>

      <section className="p-10 bg-gray-100 w-full">
        <Preguntas />
      </section>

      <section className="w-full">
        <Mapa />
      </section>

      <section id="contact-form" className="p-10 bg-gray-200 w-full">
        <ContactForm />
      </section>
    </div>
  );
};
