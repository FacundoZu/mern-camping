import React, { useRef, useState } from "react";
import { Global } from "../../../helpers/Global";

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

      console.log(formData)
      const response = await fetch(`${Global.url}enviarEmailConsulta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData
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
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 shadow-md rounded-md space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
          placeholder="Tu nombre"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
          placeholder="ejemplo@dominio.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Mensaje</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
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
  );
};

export default ContactForm;
