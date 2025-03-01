import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white  py-4 text-center">
      <p className='text-slate-600 hover:underline hidden sm:inline font-medium'>Camping Cachi &copy; {new Date().getFullYear()}. Todos los derechos reservados. </p>
    </footer>
  )
}
export default Footer;
