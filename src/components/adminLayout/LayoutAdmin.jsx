import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Header from '../adminLayout/Header.jsx';
import { FiMenu, FiX } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

export const LayoutAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { auth, loading } = useAuth();
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <div className="flex flex-1">
        <button
          className="text-2xl p-4 text-lime-800 lg:hidden"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <FiX /> : <FiMenu />}
        </button>

        <aside
          className={` fixed inset-y-0 left-0 z-40 w-64 bg-lime-700 text-white p-4 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:transform-none`}
        >
          <div className='flex flex-col sticky top-0'>
            <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
            <nav>
              <ul>
                {auth.role === 'admin' && (
                  <>
                    <li className="mb-6">
                      <Link
                        to="/admin/dashboard"
                        className="border hover:bg-lime-600 text-white transition-all border-lime-300 rounded-lg p-2 block"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li className="mb-6">
                      <Link
                        to="/admin/usuarios"
                        className="border hover:bg-lime-600 text-white transition-all border-lime-300 rounded-lg p-2 block"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Usuarios
                      </Link>
                    </li>
                  </>
                )}
                {auth.role === 'admin' || auth.role === 'gerente' ? (
                  <>
                    <li className="mb-6">
                      <Link
                        to="/admin/cabañas"
                        className="border hover:bg-lime-600 text-white transition-all border-lime-300 rounded-lg p-2 block"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Cabañas
                      </Link>
                    </li>
                    <li className="mb-6">
                      <Link
                        to="/admin/servicios"
                        className="border hover:bg-lime-600 text-white transition-all border-lime-300 rounded-lg p-2 block"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Servicios
                      </Link>
                    </li>
                    <li className="mb-6">
                      <Link
                        to="/admin/actividades"
                        className="border hover:bg-lime-600 text-white transition-all border-lime-300 rounded-lg p-2 block"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Actividades
                      </Link>
                    </li>
                    <li className="mb-6">
                      <Link
                        to="/admin/preguntas"
                        className="border hover:bg-lime-600 text-white transition-all border-lime-300 rounded-lg p-2 block"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Preguntas
                      </Link>
                    </li>
                  </>
                ) : null}
              </ul>
            </nav>
          </div>
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
