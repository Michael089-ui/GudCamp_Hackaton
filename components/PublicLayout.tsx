

import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const headerClass = "bg-gradient-to-r from-brand-green to-brand-gold";

  return (
    <header className={`${headerClass} shadow-lg font-heading sticky top-0 z-50 transition-all duration-500`}>
      <nav className="container mx-auto px-3 py-3 flex justify-between items-center">
        <NavLink to="/" className="flex items-center">
            <img 
                src="https://i.ibb.co/HfKY8xV4/GudCamp.jpg" 
                alt="GodCamp Logo" 
                className="h-12 w-auto object-contain bg-white/90 p-1 rounded-lg shadow-sm"
            />
        </NavLink>
        <div className="flex items-center space-x-6 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">
          <NavLink to="/" className={({ isActive }) => `font-medium hover:text-white/80 transition-colors duration-300 ${isActive ? 'font-extrabold' : ''}`}>Inicio</NavLink>
          <NavLink to="/about" className={({ isActive }) => `font-medium hover:text-white/80 transition-colors duration-300 ${isActive ? 'font-extrabold' : ''}`}>Sobre Nosotros</NavLink>
          <NavLink to="/plans" className={({ isActive }) => `font-medium hover:text-white/80 transition-colors duration-300 ${isActive ? 'font-extrabold' : ''}`}>Planes y Asesoría</NavLink>
          <NavLink to="/calculator" className={({ isActive }) => `font-medium hover:text-white/80 transition-colors duration-300 ${isActive ? 'font-extrabold' : ''}`}>Calculadora</NavLink>
          <NavLink to="/consultar-mercado" className={({ isActive }) => `font-medium hover:text-white/80 transition-colors duration-300 ${isActive ? 'font-extrabold' : ''}`}>Consultar Mercado</NavLink>
          
          {currentUser ? (
            <div className="flex items-center space-x-4">
               <NavLink to="/dashboard" className={({ isActive }) => `font-semibold hover:text-white/80 transition-colors duration-300 ${isActive ? 'font-extrabold' : ''}`}>
                Mis Productos
              </NavLink>
              <span className="font-medium hidden sm:block">Hola, {currentUser.name.split(' ')[0]}</span>
              <button
                onClick={logout}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <NavLink to="/login" className="hover:bg-white/10 transition-colors duration-300 font-medium py-2 px-4 rounded-xl">
                Iniciar Sesión
              </NavLink>
              <NavLink 
                to="/register" 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Registrarse
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-white text-slate-600 py-8 mt-12 border-t border-slate-200">
    <div className="container mx-auto px-6 text-center">
      <p>&copy; 2025 Mercado Agropecuario Cundiboyacense. Todos los derechos reservados.</p>
      <div className="flex justify-center space-x-4 mt-4">
        <a href="#" className="hover:text-brand-green transition-colors">Facebook</a>
        <a href="#" className="hover:text-brand-green transition-colors">Twitter</a>
        <a href="#" className="hover:text-brand-green transition-colors">LinkedIn</a>
      </div>
       <div className="mt-4 text-sm text-slate-500 space-x-4">
        <a href="#" className="hover:text-brand-dark transition-colors">Política de Privacidad</a>
        <span>|</span>
        <a href="#" className="hover:text-brand-dark transition-colors">Términos de Uso</a>
      </div>
      <p className="mt-2 text-sm text-slate-500">Contacto: info@mercadoagro.co</p>
    </div>
  </footer>
);

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;