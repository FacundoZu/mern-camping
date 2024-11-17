import React from "react";
import { RiLeafFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { Actividades } from "./utils/Actividades";
import { Preguntas } from "./utils/Preguntas";
import Mapa from "./utils/Mapa";
import ContactForm from "./utils/ContactForm";

export const Home = () => {
  const scrollToContact = () => {
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="overflow-x-hidden">
      <div className="relative h-screen bg-black/25">
        <img
          src="https://media.istockphoto.com/id/584589782/es/foto/tiendas-de-campa%C3%B1a-zona-de-acampada-temprano-en-la-ma%C3%B1ana-hermoso-lugar-natural.jpg?s=612x612&w=0&k=20&c=RPmP2NQWNM5GlXNXZBYmOYVh1-SdiEzWGd-RXPrCylo="
          alt="Imagen principal"
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
          style={{ position: "fixed" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="flex items-center font-bold text-5xl sm:text-7xl lg:text-8xl">
            <RiLeafFill className="text-lime-600 text-6xl sm:text-8xl lg:text-9xl justify-center mr-2" />
            <span className="text-white">Camping</span>
            <span className="text-lime-400 ml-2">Cachi</span>
          </h1>

          <section className="flex space-x-4 mt-6 bg-black/50 rounded-lg p-4">
            <Link
              to="/cabañas"
              className="px-6 py-3 bg-lime-600 text-white text-xl rounded-md shadow-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
            >
              Ver Cabañas
            </Link>

            <button
              onClick={scrollToContact}
              className="px-6 py-3 bg-gray-200 text-gray-800 text-xl rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
            >
              Contactar
            </button>

            <button
              onClick={scrollToContact}
              className="px-6 py-3 bg-gray-200 text-gray-800 text-xl rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
            >
              Como llegar
            </button>
          </section>
        </div>
      </div>


      <section className="p-10 bg-gray-200 w-full">
        <Actividades />
      </section>

      <section className="p-10 bg-gray-100 w-full">
        <Preguntas />
      </section>

      <section className="w-full">
        <Mapa />
      </section>

      <section id="contact-form" className="p-10 bg-gray-200 w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Formulario de Contacto</h2>
        <ContactForm />
      </section>
    </div>
  );
};
