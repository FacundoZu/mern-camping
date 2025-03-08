import React, { useEffect, useState } from 'react'
import { RiLeafFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { MenuPerfil } from '../utils/usuario/MenuPerfil';
import { CgDetailsMore } from "react-icons/cg";


export default function Header() {

  const [menu, setMenu] = useState(false);
  const { auth, loading } = useAuth();

  useEffect(() => {
    setMenu(false)
  }, [])

  const handleToggle = () => {
    setMenu(!menu)
  }

  return (
    <header className=' bg-white shadow-md border-b-2 border-neutral-500'>
      <div className='flex justify-between items-center text-balance w-5/6 mx-auto p-3'>
        <Link to="/">
          <h1 className='font-bold text-sm sm:text-xl flex items-center'>
            <RiLeafFill className='text-lime-600 justify-center mr-1 h-8 w-8' />
            <span className='text-slate-500 text-sm sm:text-xl'>Camping</span>
            <span className='text-slate-700 text-sm sm:text-xl'>Cachi</span>
          </h1>
        </Link>
        <ul className='relative flex items-center gap-6'>
          {auth && (auth.role === "admin" || auth.role === "gerente") && (
            <Link to={auth.role === "admin" ? "/admin/dashboard" : '/admin/cabañas'} className="text-slate-600 hover:underline hidden sm:inline font-medium">
              <li>Dashboard</li>
            </Link>
          )}
          <Link to="/" className="text-slate-600 hover:underline hidden sm:inline font-medium">
            <li>Home</li>
          </Link>
          <Link to="/cabañas" className="text-slate-600 hover:underline hidden sm:inline font-medium">
            <li>Cabañas</li>
          </Link>

          <button onClick={handleToggle} className="text-slate-700 sm:hidden p-1 rounded-lg flex items-center justify-center bg-slate-300 active:bg-slate-400">
            <CgDetailsMore className='w-7 h-7' />
          </button>
          {menu && (
            <MenuPerfil handleToggle={handleToggle} />
          )}

          {auth && !loading ? (

            <div onClick={handleToggle} className="flex items-center gap-4 cursor-pointer">

              <p className="relative text-lime-600 font-bold text-sm hidden sm:inline">
                {auth.name}
              </p>
              <div className='hidden sm:inline'>
                {auth.image ? (
                  <img src={auth.image} alt="Perfil" className="w-10 h-10 rounded-full border border-gray-300 shadow-sm" />
                ) : (
                  <FaUser className="w-9 h-9 p-1 rounded-full border border-gray-300 shadow-sm text-gray-400" />
                )}
              </div>

            </div>
          ) : (
            <Link to="/login" className="text-lime-600 font-medium text-lg hidden sm:inline transition duration-200">
              Iniciar sesión
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
