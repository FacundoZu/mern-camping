import React, { useEffect, useState } from 'react'
import { RiLeafFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { MenuPerfil } from './MenuPerfil';


export default function Header() {

  const [menu, setMenu] = useState(false);
  const { auth, loading } = useAuth();
  
  useEffect( () => {
    setMenu(false)
  },[])
  
  const handleToggle = () => {
    setMenu(!menu)
  }
  
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center text-balance max-w-6xl mx-auto p-3'>
        <Link to="/">
          <h1 className='font-bold text-sm sm:text-xl flex items-center'>
            <RiLeafFill className='text-lime-600 justify-center mr-1' />
            <span className='text-slate-500'>Camping</span>
            <span className='text-slate-700'>Cachi</span>
          </h1>
        </Link>
        <ul className='relative flex items-center gap-6'>
          <Link to="/" className="text-slate-600 hover:underline hidden sm:inline font-medium">
            <li>Home</li>
          </Link>
          {auth && !loading ? (
            <div className="flex items-center gap-4">
              <button onClick={handleToggle} className="relative text-lime-600 font-medium text-sm sm:text-base">
                {auth.name}
              </button>
              <button onClick={handleToggle}>
              {auth.image ? (
                <img src={auth.image} alt="Perfil" className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"/>
              ) : (
                <FaUser className="w-9 h-9 p-1 rounded-full border border-gray-300 shadow-sm text-gray-400"/>
              )}
              </button>

            {menu && (
              <MenuPerfil handleToggle={handleToggle}/>
            )}
            </div>
          ) : (
            <Link to="/login" className="text-lime-600 font-medium text-sm sm:text-base transition duration-200">
              Iniciar sesión
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
