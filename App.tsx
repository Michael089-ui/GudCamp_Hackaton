

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import useLocalStorage from './hooks/useLocalStorage';

import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import Chatbot from './components/Chatbot'; // Import the new Chatbot component

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CalculatorPage from './pages/CalculatorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import CreditsPage from './pages/admin/CreditsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import PlansPage from './pages/PlansPage';
import UserDashboardPage from './pages/user/DashboardPage';
import ApplicationsPage from './pages/admin/ApplicationsPage';

// --- Data for Consultar Mercado ---

interface Achievement {
    id: string;
    nombre: string;
    descripcion: string;
    obtenido: boolean;
}

const productsData = [
    { id: 'papa-pastusa', name: 'Papa Pastusa', icon: '🥔', price: 1800, unit: 'kg', trend: 5, region: 'Boyaca' },
    { id: 'papa-criolla', name: 'Papa Criolla', icon: '🥔', price: 2500, unit: 'kg', trend: -3, region: 'Cundinamarca' },
    { id: 'tomate-chonto', name: 'Tomate Chonto', icon: '🍅', price: 2200, unit: 'kg', trend: 8, region: 'Boyaca' },
    { id: 'cebolla-cabezona', name: 'Cebolla Cabezona', icon: '🧅', price: 1500, unit: 'kg', trend: 2, region: 'Boyaca' },
    { id: 'zanahoria', name: 'Zanahoria', icon: '🥕', price: 1300, unit: 'kg', trend: -1, region: 'Cundinamarca' },
    { id: 'maiz', name: 'Maíz', icon: '🌽', price: 1100, unit: 'kg', trend: 4, region: 'Cundinamarca' },
    { id: 'fresa', name: 'Fresa', icon: '🍓', price: 6000, unit: 'kg', trend: 10, region: 'Cundinamarca' },
    { id: 'uchuva', name: 'Uchuva', icon: '🟡', price: 4500, unit: 'kg', trend: -5, region: 'Boyaca' },
];

const companiesData = [
    { name: 'AgroCompra S.A.S', slogan: 'Apoyamos al campesino', contact: 'Tel: 310-123-4567', email: 'compras@agrocompra.co', city: 'Tunja, Boyacá', img: 'https://i.ibb.co/35150Kx8/unnamed.jpg' },
    { name: 'Fructificar Colombia', slogan: 'Del campo a tu mesa', contact: 'Tel: 320-987-6543', email: 'info@fructificar.com', city: 'Bogotá D.C.', img: 'https://i.ibb.co/0pPgCxJR/Gemini-Generated-Image-5r0eeh5r0eeh5r0e.png' },
    { name: 'Raíces & Futuro', slogan: 'Sembrando confianza', contact: 'Tel: 315-555-0101', email: 'contacto@raicesyfuturo.co', city: 'Duitama, Boyacá', img: 'https://i.ibb.co/rGY9KK74/Gemini-Generated-Image-l6ozhql6ozhql6oz.png' },
];

const initialAchievements: { [key: string]: Achievement } = {
    'primera_busqueda': { 
        id: 'primera_busqueda',
        nombre: '🔍 Explorador Inicial', 
        descripcion: 'Realiza tu primera búsqueda.',
        obtenido: false 
    },
    'filtro_maestro': { 
        id: 'filtro_maestro',
        nombre: '📊 Analista', 
        descripcion: 'Usa un filtro de categoría.',
        obtenido: false 
    },
    'mapa_interactivo': { 
        id: 'mapa_interactivo',
        nombre: '🗺️ Cartógrafo', 
        descripcion: 'Haz clic en una región del mapa.',
        obtenido: false 
    }
};
// --- End of Data ---

const AchievementNotification: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const confettiPieces = useMemo(() => Array.from({ length: 20 }).map((_, i) => {
        const colors = ['#FFD700', '#FFEC8B', '#6DBE45', '#fff'];
        return {
            id: i,
            style: {
                left: `${Math.random() * 100}%`,
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
            },
        };
    }), []);

    return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-brand-gold-dark w-80 relative overflow-hidden animate-slideInAndOut">
            <div className="flex items-center">
                <div className="text-3xl mr-3">🏆</div>
                <div>
                    <h4 className="font-bold text-brand-dark font-heading">¡Logro Desbloqueado!</h4>
                    <p className="text-sm text-slate-600">{achievement.nombre}</p>
                </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {confettiPieces.map(piece => (
                    <div key={piece.id} className="confetti" style={piece.style}></div>
                ))}
            </div>
        </div>
    );
};


const ConsultarMercadoPage: React.FC = () => {
    const [showAds, setShowAds] = useState({ left: false, right: false });
    const [triggerAnimation, setTriggerAnimation] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [displayedProducts, setDisplayedProducts] = useState(productsData);
    
    // Use regular useState to ensure achievements reset on page reload.
    const [achievements, setAchievements] = useState(initialAchievements);
    const [notificationQueue, setNotificationQueue] = useState<Achievement[]>([]);
    const prevAchievementsRef = useRef(achievements);

    const productRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

    // Effect for entry animations
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAds({ left: true, right: true });
        }, 100);
        setTriggerAnimation(true);
        return () => clearTimeout(timer);
    }, []);

    // Effect for filtering products
    useEffect(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = productsData.filter(product => {
            const regionMatch = activeFilter === 'Todos' || product.region === activeFilter;
            const searchMatch = !searchTerm || product.name.toLowerCase().includes(lowercasedTerm);
            return regionMatch && searchMatch;
        });
        setDisplayedProducts(filtered);
    }, [searchTerm, activeFilter]);
    
    // Effect to detect newly unlocked achievements and queue notifications
    useEffect(() => {
        const newlyUnlocked = Object.keys(achievements)
            .filter(key => achievements[key].obtenido && !prevAchievementsRef.current[key].obtenido)
            .map(key => achievements[key]);
        
        if (newlyUnlocked.length > 0) {
            setNotificationQueue(prev => [...prev, ...newlyUnlocked]);
        }

        prevAchievementsRef.current = achievements;
    }, [achievements]);

    // Effect to manage notification display timing
    useEffect(() => {
        if (notificationQueue.length > 0) {
            const timer = setTimeout(() => {
                setNotificationQueue(prev => prev.slice(1)); // Remove the first item after 5 seconds
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notificationQueue]);
    
    const unlockAchievement = (id: string) => {
        setAchievements(prevAchievements => {
            if (prevAchievements[id] && !prevAchievements[id].obtenido) {
                // The console.log will now be handled by the notification system
                const newAchievements = {
                    ...prevAchievements,
                    [id]: { ...prevAchievements[id], obtenido: true }
                };
                return newAchievements;
            }
            return prevAchievements; // No change needed
        });
    };

    const handleSearch = () => {
        unlockAchievement('primera_busqueda');
    };
    
    const handleFilterClick = (region: string) => {
        setActiveFilter(region);
        unlockAchievement('filtro_maestro');
    };
    
    const handleMapIconClick = (productId: string) => {
        productRefs.current[productId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        unlockAchievement('mapa_interactivo');
    };
    
    const handleCloseAd = (side: 'left' | 'right') => {
        setShowAds(prev => ({ ...prev, [side]: false }));
    };

    const FruitRainAnimation: React.FC = () => (
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {triggerAnimation && Array.from({ length: 15 }).map((_, i) => {
          const icons = ['🥔', '🌽', '🍅', '🧅', '🥕', '🍓'];
          const icon = icons[Math.floor(Math.random() * icons.length)];
          const style = {
            left: `${Math.random() * 95}vw`,
            animationName: 'fruitRain',
            animationDuration: `${Math.random() * 5 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 1.5 + 1}rem`
          };
          return <div key={i} className="absolute animate-fruitRain text-2xl" style={style}>{icon}</div>;
        })}
      </div>
    );
  
    return (
      <div className="relative overflow-x-clip">
        <FruitRainAnimation />
        <div className={`ad-sidebar ad-left ${showAds.left ? 'ad-visible' : ''}`}>
          <button onClick={() => handleCloseAd('left')} className="ad-close-btn" aria-label="Cerrar publicidad izquierda">
            &times;
          </button>
          <img src="https://i.ibb.co/dwSFSr0p/unnamed.jpg" alt="Publicidad" className="w-full h-full object-cover" />
        </div>
        <div className={`ad-sidebar ad-right ${showAds.right ? 'ad-visible' : ''}`}>
          <button onClick={() => handleCloseAd('right')} className="ad-close-btn" aria-label="Cerrar publicidad derecha">
            &times;
          </button>
          <img src="https://i.ibb.co/MxWMzbqm/unnamed.jpg" alt="Publicidad" className="w-full h-full object-cover" />
        </div>

        {/* Notification Area */}
        <div className="fixed top-20 right-4 z-[100] space-y-2">
            {notificationQueue.length > 0 && (
                <AchievementNotification achievement={notificationQueue[0]} />
            )}
        </div>

        <div className="container mx-auto px-6 py-12 relative z-10">
          {/* Intro Section */}
          <section className="mb-16 text-center animate-fadeIn">
            <h1 className="text-4xl font-extrabold text-brand-dark font-heading">Mercado Cundiboyacense</h1>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Consulta precios actualizados, encuentra compradores y mantente al día con las tendencias del mercado agrícola en la región.
            </p>
             <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-8 bg-white p-8 rounded-2xl shadow-lg">
                <div className="md:w-1/2 text-left">
                    <h2 className="text-2xl font-bold text-brand-green font-heading mb-4">Tu Herramienta de Mercado</h2>
                    <p className="text-slate-700">Utiliza nuestros datos para tomar decisiones informadas, planificar tus ventas y maximizar la rentabilidad de tu cosecha. Información confiable, al alcance de tu mano.</p>
                </div>
                <div className="md:w-1/2">
                    {/*//Nota*/}
                    <img src="https://i.ibb.co/TMwb1Scr/Campo.jpg" alt="Mercado agrícola" className="rounded-xl shadow-md w-full h-64 object-cover"/>
                </div>
             </div>
          </section>

          {/* Weekly Prices Section */}
          <section id="precios" className="mb-16 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl font-bold text-center text-brand-dark mb-8 font-heading">Precios Semanales</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
              <input 
                id="searchInput"
                type="text" 
                placeholder="Buscar producto..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="p-3 border rounded-xl w-full md:w-1/3 shadow-sm"
              />
              <button onClick={handleSearch} className="bg-brand-green text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-brand-green-dark transition-colors w-full md:w-auto">Buscar</button>
            </div>
            <div className="flex justify-center gap-2 mb-8">
                {['Todos', 'Boyaca', 'Cundinamarca'].map(region => (
                    <button 
                        key={region}
                        onClick={() => handleFilterClick(region)}
                        className={`filter-btn py-2 px-5 rounded-full font-semibold transition-colors ${activeFilter === region ? 'bg-brand-dark text-white' : 'bg-white shadow-sm'}`}
                    >
                        {region}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedProducts.map(product => (
                <div key={product.id} ref={el => { productRefs.current[product.id] = el; }} className="product-card bg-white p-4 rounded-xl shadow-lg border border-transparent hover:border-brand-green transition-all duration-300 transform hover:scale-105">
                  <div className="text-4xl text-center mb-2">{product.icon}</div>
                  <h3 className="font-bold text-lg text-center font-heading">{product.name}</h3>
                  <p className="text-center text-xl font-extrabold text-brand-dark my-2">{product.price.toLocaleString('es-CO', {style: 'currency', currency: 'COP', minimumFractionDigits: 0})}/{product.unit}</p>
                  <p className={`text-center font-bold ${product.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.trend > 0 ? `↑ +${product.trend}%` : `↓ ${product.trend}%`} esta semana
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Purchasing Companies Section */}
          <section className="mb-16 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-3xl font-bold text-center text-brand-dark mb-8 font-heading">Empresas Compradoras</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {companiesData.map(company => (
                    <div key={company.name} className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <img src={company.img} alt={company.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-brand-green-light"/>
                        <h3 className="font-bold text-xl font-heading">{company.name}</h3>
                        <p className="text-slate-500 italic my-2">"{company.slogan}"</p>
                        <p className="font-semibold text-brand-dark">{company.city}</p>
                        <p className="text-sm text-slate-600">{company.contact}</p>
                        <p className="text-sm text-brand-blue font-semibold">{company.email}</p>
                    </div>
                ))}
            </div>
          </section>

          {/* Map Section */}
          <section className="mb-16 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-3xl font-bold text-center text-brand-dark mb-8 font-heading">Mapa de la Región</h2>
            <div className="bg-gradient-to-br from-green-200 to-sky-200 p-8 rounded-2xl shadow-lg h-96 relative flex items-center justify-around">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl font-bold text-white bg-brand-dark/30 px-4 py-1 rounded-full">Región Cundiboyacense</div>
                {/* Boyaca */}
                <div className="region-boyaca text-center cursor-pointer" onClick={() => handleMapIconClick('papa-pastusa')}>
                    <h3 className="text-2xl font-bold text-green-800 mb-4 font-heading">Boyacá</h3>
                    <div className="space-x-4">
                        <span className="text-4xl transform hover:scale-125 transition-transform inline-block">🥔</span>
                        <span className="text-4xl transform hover:scale-125 transition-transform inline-block">🍅</span>
                        <span className="text-4xl transform hover:scale-125 transition-transform inline-block">🟡</span>
                    </div>
                </div>
                 {/* Cundinamarca */}
                <div className="region-cundinamarca text-center cursor-pointer" onClick={() => handleMapIconClick('fresa')}>
                    <h3 className="text-2xl font-bold text-sky-800 mb-4 font-heading">Cundinamarca</h3>
                    <div className="space-x-4">
                         <span className="text-4xl transform hover:scale-125 transition-transform inline-block">🍓</span>
                         <span className="text-4xl transform hover:scale-125 transition-transform inline-block">🌽</span>
                         <span className="text-4xl transform hover:scale-125 transition-transform inline-block">🥕</span>
                    </div>
                </div>
            </div>
          </section>

          {/* Achievements Section */}
          <section className="sistema-logros mb-16 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-brand-dark font-heading">🏆 Tus Logros</h2>
              <p className="text-slate-600">Desbloquea logros mientras exploras nuestra plataforma</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="logrosContainer">
                {/* FIX: Explicitly type 'ach' as Achievement to resolve TS errors. */}
                {Object.values(achievements).map((ach: Achievement) => (
                    <div key={ach.id} id={`logro-${ach.id}`} className={`logro ${ach.obtenido ? 'obtenido' : ''}`}>
                        <h4 className="text-lg font-bold font-heading">{ach.nombre}</h4>
                        <p className="text-sm mt-1">{ach.descripcion}</p>
                    </div>
                ))}
            </div>
          </section>
          
          {/* Contact Section */}
           <section className="animate-fadeIn" style={{ animationDelay: '1s' }}>
              <h2 className="text-3xl font-bold text-center text-brand-dark mb-8 font-heading">Contáctanos</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <h3 className="font-bold text-xl mb-2 font-heading">Teléfono</h3>
                        <p className="text-slate-600 mb-4">(+57) 300 123 4567</p>
                        <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">WhatsApp</a>
                   </div>
                   <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <h3 className="font-bold text-xl mb-2 font-heading">Email</h3>
                        <p className="text-slate-600 mb-4">info@mercadoagro.co</p>
                        <a href="mailto:info@mercadoagro.co" className="bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors">Enviar Correo</a>
                   </div>
                   <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <h3 className="font-bold text-xl mb-2 font-heading">Oficinas</h3>
                        <p className="text-slate-600 mb-4">Cra 10 # 28-49, Tunja, Boyacá</p>
                        <a href="#" className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors">Ver en Mapa</a>
                   </div>
               </div>
           </section>

        </div>
      </div>
    );
};


const App: React.FC = () => {
  return (
    <HashRouter>
      <DataProvider>
        <AuthProvider>
          <Routes>
            {/* Public and User Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="plans" element={<PlansPage />} />
              <Route path="calculator" element={<CalculatorPage />} />
              <Route path="consultar-mercado" element={<ConsultarMercadoPage />} />
              <Route 
                path="dashboard" 
                element={
                  <UserProtectedRoute>
                    <UserDashboardPage />
                  </UserProtectedRoute>
                } 
              />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="credits" element={<CreditsPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
          </Routes>
          <Chatbot />
        </AuthProvider>
      </DataProvider>
    </HashRouter>
  );
};

export default App;