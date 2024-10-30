import React from "react";
import { RiLeafFill } from "react-icons/ri";
import { Link } from "react-router-dom";

export const Home = () => {

  const scrollToContact = () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <div className="relative h-screen bg-black/35">
        <img
          src="https://media.istockphoto.com/id/584589782/es/foto/tiendas-de-campa%C3%B1a-zona-de-acampada-temprano-en-la-ma%C3%B1ana-hermoso-lugar-natural.jpg?s=612x612&w=0&k=20&c=RPmP2NQWNM5GlXNXZBYmOYVh1-SdiEzWGd-RXPrCylo="
          alt="Imagen principal"
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
          style={{ position: 'fixed' }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className='flex items-center font-bold text-5xl sm:text-7xl lg:text-8xl'>
            <RiLeafFill className='text-lime-600 text-6xl sm:text-8xl lg:text-9xl justify-center mr-2' />
            <span className='text-white'>Camping</span>
            <span className='text-lime-400 ml-2'>Cachi</span>
          </h1>

          <section className="flex space-x-4 mt-6">
            <Link
              to='/cabañas'
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
          </section>
        </div>
      </div>

      <section className="p-10 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6">Preguntas Frecuentes</h2>
        <div className="space-y-6">
          <div className="bg-white p-6 shadow-md rounded-md">
            <h3 className="text-xl font-semibold">¿Cómo puedo registrarme?</h3>
            <p>Puedes registrarte haciendo clic en el botón de "Registro" en la esquina superior derecha.</p>
          </div>
          <div className="bg-white p-6 shadow-md rounded-md">
            <h3 className="text-xl font-semibold">¿Dónde puedo encontrar información sobre los servicios?</h3>
            <p>En la sección de "Servicios" puedes encontrar información detallada sobre todo lo que ofrecemos.</p>
          </div>
          <div className="bg-white p-6 shadow-md rounded-md">
            <h3 className="text-xl font-semibold">¿Cómo puedo contactar con soporte?</h3>
            <p>Puedes enviarnos un mensaje utilizando el formulario de contacto a continuación.</p>
          </div>
        </div>
      </section>

      <section id="contact-form" className="p-10 bg-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6">Formulario de Contacto</h2>
        <form className="max-w-md mx-auto bg-white p-6 shadow-md rounded-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Tu nombre"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="ejemplo@dominio.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mensaje</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              rows="4"
              placeholder="Escribe tu mensaje"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-lime-600 text-white py-2 rounded-md shadow-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Enviar
          </button>
        </form>
      </section>
    </div>
  );
};
