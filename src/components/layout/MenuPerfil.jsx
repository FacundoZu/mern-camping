import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { FaEdit, FaUser } from "react-icons/fa";
import { TbLogout, TbHomeSearch } from "react-icons/tb";
import { IoHome } from "react-icons/io5";

export const MenuPerfil = ({ handleToggle = null }) => {

    const { auth } = useAuth();

    const logout = async () => {
        try {
            const response = await fetch('http://localhost:3900/api/user/logout', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                window.location.href = '/home';
            } else {
                console.error('Error en la respuesta del servidor.');
            }
        } catch (error) {
            console.error('Error durante el logout:', error);
        }
    };

    return (
        <div onClick={handleToggle} onMouseLeave={handleToggle} className='absolute top-14 right-0 bg-slate-100 border-2 rounded-xl p-2 z-10'>
            {auth ? (
                <div className='flex flex-col mx-3'>
                    <div className='flex pb-3 items-center my-1'>
                        {auth.image ? (
                            <img
                                src={auth.image}
                                alt="Perfil"
                                className="w-9 h-9 rounded-full border border-gray-300 shadow-sm"
                            />
                        ) : (
                            <FaUser className="w-9 h-9 p-1 rounded-full border border-gray-300 shadow-sm text-gray-400" />
                        )}
                        <div className='flex flex-col ml-2 text-slate-700 w-44 box-border'>
                            <span className='text-slate-700 font-medium text-sm sm:text-base overflow-hidden whitespace-nowrap text-ellipsis'>
                                {auth.name}
                            </span>
                            <span className='text-slate-500 font-medium text-xs '>{auth.email}</span>
                        </div>
                    </div>
                    <hr className='my-1 h-px w-full bg-gray-300 border-0 dark:bg-gray-600' />
                    {auth && auth.role == "admin" &&<Link to='/admin/dashboard' className="text-slate-700 m-1.5 rounded-lg p-2 font-medium text-sm sm:hidden flex items-center justify-center hover:bg-slate-300">
                        <IoHome className='mr-1 text-slate-500' />
                        Dashboard
                    </Link>}
                    <Link to='/' className="text-slate-700 m-1.5 rounded-lg p-2 font-medium text-sm sm:hidden flex items-center justify-center hover:bg-slate-300">
                        <IoHome className='mr-1 text-slate-500' />
                        Home
                    </Link>
                    <Link to='/cabañas' className="text-slate-700 m-1.5 rounded-lg p-2 font-medium text-sm sm:hidden flex items-center justify-center hover:bg-slate-300">
                        <TbHomeSearch className='mr-1 text-slate-500' />
                        Cabañas
                    </Link>
                    <Link to='/perfil' className="text-slate-700 m-1.5 rounded-lg p-2 font-medium text-sm sm:text-base flex items-center justify-center hover:bg-slate-300">
                        <FaEdit className='mr-1 text-slate-500' />
                        Perfil
                    </Link>
                    <hr className='my-1 h-px w-full bg-gray-300 border-0 dark:bg-gray-600' />
                    <button onClick={logout} className="text-slate-700 m-1.5 rounded-lg p-2 font-medium text-sm sm:text-base flex items-center justify-center hover:bg-slate-300">
                        <TbLogout className='mr-1' />
                        Cerrar sesión
                    </button>
                </div>
            ) : (
                <div className='flex flex-col mx-3 w-48'>
                    <Link to='/' className="text-slate-700 m-1.5 rounded-lg p-2 font-medium text-sm sm:hidden flex items-center justify-center hover:bg-slate-300">
                        <IoHome className='mr-1 text-slate-500' />
                        Home
                    </Link>
                    <Link to='/cabañas' className="text-slate-700 m-1.5 rounded-lg p-2 font-medium text-sm sm:hidden flex items-center justify-center hover:bg-slate-300">
                        <TbHomeSearch className='mr-1 text-slate-500' />
                        Cabañas
                    </Link>
                    <hr className='my-1 h-px w-full bg-gray-300 border-0 dark:bg-gray-600' />
                    <Link to="/login" className="text-slate-700 m-1.5 rounded-lg p-2 font-medium text-sm sm:hidden flex items-center justify-center hover:bg-slate-300">
                        Iniciar sesión
                    </Link>
                </div>

            )}
        </div>
    );

}
