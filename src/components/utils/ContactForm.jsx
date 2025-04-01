import React, { useRef, useState } from "react";
import { Global } from "../../helpers/Global";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await fetch(`${Global.url}enviarEmailConsulta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
        }),
      });

      if (response.status) {
        alert("Correo enviado correctamente");
      } else {
        alert("Error al enviar el correo");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid md:grid-cols-2 shadow-lg rounded-lg overflow-hidden">
        <div className="space-y-6 bg-lime-600 p-9 flex flex-col justify-between text-white">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">Contacto</h2>
            <p className="mt-2 text-lg text-lime-100">
              Rellena el formulario para enviarnos un mensaje y nos pondremos en contacto contigo lo antes posible.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Síguenos en redes sociales</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full p-2 text-white hover:bg-gradient-to-b from-lime-500 to-lime-600 transition-colors"
              >
                <FaFacebookSquare size={24} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full p-2 text-white hover:bg-gradient-to-b from-lime-500 to-lime-600 transition-colors"
              >
                <FaInstagram size={24} />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white p-9">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
                rows="4"
                placeholder="Escribe tu mensaje"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-lime-600 text-white py-3 rounded-lg shadow-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 transition-all"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;