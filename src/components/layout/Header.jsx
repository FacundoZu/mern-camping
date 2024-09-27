import React from 'react'
import { RiLeafFill } from "react-icons/ri";
import { Link } from 'react-router-dom';


export default function Header() {
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to="/">
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
          <RiLeafFill className='text-green-400 m-auto items-center mt-1.5 mr-1' />
          <span className='text-slate-500'>Camping</span>
          <span className='text-slate-700'>Cachi</span>
        </h1>
        </Link>
        <ul className='flex gap-4 '>
          <Link to="/">
          <li className='hidden sm:inline text-green-950 hover:underline'>Home</li>
          </Link>
          <Link to="/login">
          <li className='text-green-950 hover:underline'>Iniciar Sesión</li>
          </Link>
        </ul>
      </div>
    </header>
  )
}
