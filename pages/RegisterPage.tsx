

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const { userRegister } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !location) {
        setError('Todos los campos son obligatorios.');
        return;
    }
    
    const newUser = userRegister({ name, email, password, location });

    if (!newUser) {
      setError('Este correo electrónico ya está en uso. Por favor, intenta con otro.');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: "url('https://i.ibb.co/5WSrkqYJ/banner.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl animate-scaleIn">
        <h1 className="text-3xl font-bold text-center text-brand-dark mb-2 font-heading">Crear una Cuenta</h1>
        <p className="text-center text-slate-700 mb-6">Regístrate para acceder a todos nuestros beneficios.</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 font-heading" htmlFor="name">Nombre Completo</label>
            <input 
              type="text" 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green transition"
              required 
            />
          </div>
           <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 font-heading" htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green transition"
              required 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 font-heading" htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green transition"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 font-heading" htmlFor="location">Ubicación (Departamento)</label>
            <input 
              type="text" 
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green transition"
              placeholder="Ej: Antioquia"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button type="submit" className="w-full bg-gradient-to-r from-brand-green to-brand-gold hover:from-brand-green-dark hover:to-brand-gold-dark text-white font-bold py-3 rounded-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] font-heading">
            Crear Cuenta
          </button>
        </form>
         <p className="text-center mt-6 text-slate-800">
            ¿Ya tienes una cuenta? <Link to="/login" className="font-bold bg-gradient-to-r from-brand-green to-brand-gold bg-clip-text text-transparent hover:opacity-80 font-heading">Inicia Sesión aquí</Link>
          </p>
           <button onClick={() => navigate('/')} className="w-full mt-4 text-center text-sm bg-gradient-to-r from-brand-green to-brand-gold bg-clip-text text-transparent hover:opacity-80 font-semibold font-heading">
            Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;