

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { 
    RocketLaunchIcon, 
    ShieldCheckIcon, 
    SunIcon,
    CpuChipIcon, 
    AcademicCapIcon, 
    BuildingLibraryIcon,
    UserIcon,
    EnvelopeIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/solid';

// --- HOOKS ---
// NOTE: In a larger project, these hooks would be in separate files (e.g., /hooks/useOnScreen.ts)
const useOnScreen = (ref: React.RefObject<HTMLElement>, rootMargin = '0px'): boolean => {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIntersecting(entry.isIntersecting),
            { rootMargin }
        );
        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, rootMargin]);

    return isIntersecting;
};

const useAnimatedCounter = (target: number, isVisible: boolean, duration: number = 2000): number => {
    const [count, setCount] = useState(0);
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);

    useEffect(() => {
        if (!isVisible) return;

        let frame = 0;
        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentCount = Math.round(target * progress);
            setCount(currentCount);

            if (frame === totalFrames) {
                clearInterval(counter);
                 setCount(target); // Ensure it ends on the exact target
            }
        }, frameRate);

        return () => clearInterval(counter);
    }, [target, isVisible, duration, frameRate, totalFrames]);

    return count;
};


// --- HERO SECTION ---
const Hero: React.FC = () => (
  <div className="relative overflow-hidden h-[70vh] flex items-center justify-center">
    <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://i.ibb.co/5WSrkqYJ/banner.jpg')" }}
    ></div>
    <div className="absolute inset-0 bg-brand-dark/60"></div>
    <div className="container mx-auto px-6 text-center relative z-10">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight font-heading text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.6)] animate-fadeIn">
        Impulsamos el campo con tecnología y finanzas justas
      </h1>
      <p 
        className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-slate-50 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] animate-fadeIn"
        style={{ animationDelay: '0.3s' }}
      >
        Conectamos a los agricultores con herramientas financieras fáciles de usar.
      </p>
      <Link 
        to="/plans" 
        className="mt-10 inline-flex items-center gap-3 bg-gradient-to-r from-brand-green to-brand-gold hover:from-brand-green-dark hover:to-brand-gold-dark text-white font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] font-heading animate-fadeIn"
        style={{ animationDelay: '0.6s' }}
      >
        Explora nuestros planes <span aria-hidden="true">→</span>
      </Link>
    </div>
  </div>
);


// --- BENEFITS SECTION ---
const BenefitCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="bg-white p-8 rounded-xl shadow-md text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col items-center">
        <div className="text-4xl bg-gradient-to-br from-brand-green to-brand-green-dark text-white mb-5 rounded-full p-4 inline-block">{icon}</div>
        <h3 className="text-2xl font-bold mb-3 text-brand-dark font-heading">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
);

const Benefits: React.FC = () => (
    <section className="py-20 bg-brand-beige">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-brand-dark font-heading">¿Por qué elegirnos?</h2>
                <p className="text-lg text-gray-700 mt-2">Te ofrecemos una experiencia simple, justa y transparente.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
                <BenefitCard title="Acceso Rápido" description="Procesos ágiles para que obtengas tu crédito sin demoras ni papeleo innecesario." icon={<RocketLaunchIcon className="h-10 w-10"/>} />
                <BenefitCard title="Asesoría Rural" description="Entendemos las necesidades del campo y ofrecemos soluciones financieras a tu medida." icon={<SunIcon className="h-10 w-10"/>} />
                <BenefitCard title="Financiamiento Responsable" description="Tasas justas y acompañamiento para un futuro financiero sostenible y próspero." icon={<ShieldCheckIcon className="h-10 w-10"/>} />
            </div>
        </div>
    </section>
);

// --- PLANS SUMMARY SECTION ---
const PlansSummary: React.FC = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-brand-dark font-heading">Nuestros Planes</h2>
                <p className="text-lg text-gray-700 mt-2">Soluciones de crédito para cada etapa de tu cultivo.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
                <div className="bg-slate-50 p-8 rounded-xl shadow-lg border border-slate-200 transition-all duration-300 hover:shadow-xl hover:border-brand-green">
                    <CpuChipIcon className="h-12 w-12 text-brand-green mb-4"/>
                    <h3 className="text-2xl font-bold text-brand-dark font-heading">Plan Semilla 🌱</h3>
                    <p className="text-gray-600 mt-2 mb-6">Microcréditos ágiles para arrancar tus proyectos.</p>
                    <Link to="/plans" className="font-bold text-brand-green hover:underline font-heading">Conocer más →</Link>
                </div>
                <div className="bg-slate-50 p-8 rounded-xl shadow-lg border border-slate-200 transition-all duration-300 hover:shadow-xl hover:border-brand-green">
                    <AcademicCapIcon className="h-12 w-12 text-brand-green mb-4"/>
                    <h3 className="text-2xl font-bold text-brand-dark font-heading">Plan Cosecha</h3>
                    <p className="text-gray-600 mt-2 mb-6">Créditos a mediano plazo para optimizar tu producción.</p>
                    <Link to="/plans" className="font-bold text-brand-green hover:underline font-heading">Conocer más →</Link>
                </div>
                <div className="bg-slate-50 p-8 rounded-xl shadow-lg border border-slate-200 transition-all duration-300 hover:shadow-xl hover:border-brand-green">
                    <BuildingLibraryIcon className="h-12 w-12 text-brand-green mb-4"/>
                    <h3 className="text-2xl font-bold text-brand-dark font-heading">Plan Raíz</h3>
                    <p className="text-gray-600 mt-2 mb-6">Financiamiento estratégico para grandes proyectos.</p>
                    <Link to="/plans" className="font-bold text-brand-green hover:underline font-heading">Conocer más →</Link>
                </div>
            </div>
        </div>
    </section>
);

// --- IMPACT STATS SECTION ---
const StatCounter: React.FC<{ value: number, label: string, isVisible: boolean, formatter?: (n: number) => string }> = ({ value, label, isVisible, formatter }) => {
    const count = useAnimatedCounter(value, isVisible);
    const displayValue = formatter ? formatter(count) : count.toLocaleString('es-CO');
    return (
        <div className="text-center">
            <p className="text-5xl font-extrabold text-white font-heading">{displayValue}</p>
            <p className="mt-2 text-lg text-white/80 font-medium font-heading">{label}</p>
        </div>
    );
};

const ImpactStats: React.FC = () => {
    const { users, credits } = useData();
    const statsRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(statsRef, '-100px');

    const totalDisbursed = credits.reduce((sum, credit) => sum + credit.amount, 0);

    return (
        <section ref={statsRef} className="py-20 bg-gradient-to-r from-brand-green to-brand-blue">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-10">
                    <StatCounter value={users.length} label="Agricultores Beneficiados" isVisible={isVisible} />
                    <StatCounter 
                        value={totalDisbursed} 
                        label="Total en Créditos Otorgados" 
                        isVisible={isVisible}
                        formatter={(n) => `$${(n / 1000000).toFixed(1)}M`}
                    />
                    <StatCounter value={credits.length} label="Simulaciones Realizadas" isVisible={isVisible} />
                </div>
            </div>
        </section>
    );
};


// --- TESTIMONIALS SECTION ---
const TestimonialCard: React.FC<{ quote: string; name: string; role: string; imgSrc: string; }> = ({ quote, name, role, imgSrc }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <p className="text-gray-600 italic mb-6 flex-grow">"{quote}"</p>
        <div className="flex items-center">
            <img 
                src={imgSrc}
                alt={name}
                className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-brand-green"
            />
            <div>
                <p className="font-bold text-brand-dark font-heading">{name}</p>
                <p className="text-sm text-gray-500">{role}</p>
            </div>
        </div>
    </div>
);

const Testimonials: React.FC = () => (
    <section className="py-20 bg-brand-beige">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-brand-dark font-heading">Lo que dicen nuestros agricultores</h2>
                <p className="text-lg text-gray-700 mt-2">Historias de éxito que nos inspiran a seguir adelante.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <TestimonialCard
                    quote="Gracias a la plataforma, logré financiar mi cultivo sin intermediarios. La calculadora me dio la confianza que necesitaba para planificar la cosecha de café. ¡Totalmente recomendado!"
                    name="Carlos Jiménez"
                    role="Caficultor de Antioquia"
                    imgSrc="https://i.ibb.co/hJw0FkCn/09a380f8-7738-4d7c-beb9-e1a5aaf9172e.jpg"
                />
                <TestimonialCard
                    quote="El Plan Semilla fue perfecto para empezar. El proceso fue rápido y sin complicaciones. Pude comprar los insumos a tiempo y asegurar una buena siembra de maíz."
                    name="Lucía Hernandez"
                    role="Productora de Maíz, Boyacá"
                    imgSrc="https://i.ibb.co/93d0Y5Ps/4018ab86-59e0-4e93-9474-97cbc5fbf299.jpg"
                />
                <TestimonialCard
                    quote="Estaba buscando expandir mi cultivo de plátano y el Plan Raíz me dio el impulso que necesitaba. La asesoría fue clave para tomar la mejor decisión financiera."
                    name="Javier Moreno"
                    role="Productor de Plátano, Valle del Cauca"
                    imgSrc="https://i.ibb.co/yBPbsBg1/BCO-2fc4fc4b-aca2-4ea6-946f-b879577abf56.png"
                />
            </div>
        </div>
    </section>
);

// --- CONTACT FORM SECTION ---
const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const validate = () => {
        const newErrors: { name?: string; email?: string; message?: string } = {};
        if (!formData.name) newErrors.name = 'El nombre es requerido.';
        if (!formData.email) {
            newErrors.email = 'El correo es requerido.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El formato del correo no es válido.';
        }
        if (!formData.message) newErrors.message = 'El mensaje es requerido.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setStatus('submitting');
        setTimeout(() => { // Simulate API call
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (status !== 'idle') setStatus('idle');
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-brand-dark font-heading">¡Contáctanos! Estamos aquí para ayudarte.</h2>
                    <p className="text-lg text-gray-700 mt-2">¿Tienes preguntas? Llena el formulario y te responderemos pronto.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-50 p-8 rounded-xl shadow-lg border border-slate-200">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 font-bold mb-2 font-heading">Nombre completo</label>
                            <div className="relative">
                                <UserIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-3"/>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full p-3 pl-10 border rounded-xl ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
                            </div>
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-bold mb-2 font-heading">Correo electrónico</label>
                             <div className="relative">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-3"/>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full p-3 pl-10 border rounded-xl ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="message" className="block text-gray-700 font-bold mb-2 font-heading">Mensaje</label>
                         <div className="relative">
                            <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-3"/>
                            <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} className={`w-full p-3 pl-10 border rounded-xl ${errors.message ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                        </div>
                        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                    </div>
                    
                    <div className="text-center">
                        <button type="submit" disabled={status === 'submitting'} className="font-heading bg-gradient-to-r from-brand-green to-brand-gold hover:from-brand-green-dark hover:to-brand-gold-dark text-white font-bold py-3 px-8 rounded-xl text-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] disabled:from-slate-400 disabled:to-slate-500 disabled:scale-100 disabled:shadow-none">
                            {status === 'submitting' ? 'Enviando...' : 'Enviar Consulta'}
                        </button>
                    </div>

                    {status === 'success' && (
                        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-3 animate-fadeIn">
                            <CheckCircleIcon className="h-6 w-6"/>
                            <p>¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.</p>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3 animate-fadeIn">
                            <ExclamationCircleIcon className="h-6 w-6"/>
                            <p>Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo.</p>
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
};

// --- FINAL CTA SECTION ---
const FinalCTA: React.FC = () => (
    <section className="py-20 bg-gradient-to-r from-brand-green to-brand-blue text-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold font-heading">¿Listo para potenciar tu cultivo?</h2>
            <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
                No esperes más para tomar el control de tus finanzas. Empieza hoy mismo con una simulación gratuita y sin compromiso.
            </p>
            <Link 
                to="/calculator" 
                className="mt-8 inline-block bg-gradient-to-r from-brand-green to-brand-gold hover:from-brand-green-dark hover:to-brand-gold-dark text-white font-bold py-3 px-8 rounded-xl text-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] font-heading"
            >
                Prueba la calculadora ahora
            </Link>
        </div>
    </section>
);


// --- MAIN HOME PAGE COMPONENT ---
const HomePage: React.FC = () => {
  return (
    <div className="animate-fadeIn">
      <Hero />
      <Benefits />
      <PlansSummary />
      <ImpactStats />
      <Testimonials />
      <ContactForm />
      <FinalCTA />
    </div>
  );
};

export default HomePage;