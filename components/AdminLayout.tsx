
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChartPieIcon, UsersIcon, CurrencyDollarIcon, PresentationChartLineIcon, ArrowLeftOnRectangleIcon, DocumentDuplicateIcon } from '@heroicons/react/24/solid';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 p-3 rounded-lg text-slate-700 hover:bg-brand-green/20 transition-colors duration-200 font-heading font-semibold ${isActive ? 'bg-brand-green/30 text-brand-dark' : ''}`;

  return (
    <div className="w-64 bg-white text-brand-dark flex flex-col p-4 border-r border-slate-200">
      <div className="p-4 mb-8">
        <img 
            src="https://i.ibb.co/HfKY8xV4/GudCamp.jpg" 
            alt="GodCamp Logo" 
            className="h-14 w-auto mx-auto object-contain"
        />
      </div>
      <nav className="flex-grow space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase px-3 font-sans">Menú Principal</span>
        <NavLink to="/admin/dashboard" className={navLinkClass}>
          <ChartPieIcon className="h-5 w-5" /> Dashboard
        </NavLink>
        <NavLink to="/admin/users" className={navLinkClass}>
          <UsersIcon className="h-5 w-5" /> Usuarios
        </NavLink>
        <NavLink to="/admin/credits" className={navLinkClass}>
          <CurrencyDollarIcon className="h-5 w-5" /> Créditos
        </NavLink>
         <NavLink to="/admin/applications" className={navLinkClass}>
          <DocumentDuplicateIcon className="h-5 w-5" /> Solicitudes
        </NavLink>
        <NavLink to="/admin/analytics" className={navLinkClass}>
          <PresentationChartLineIcon className="h-5 w-5" /> Analíticas
        </NavLink>
      </nav>
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 w-full text-left p-3 rounded-lg text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 font-heading font-semibold"
      >
        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
        Cerrar Sesión
      </button>
    </div>
  );
};

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto animate-fadeIn">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;