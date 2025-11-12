

import React from 'react';
import { AcademicCapIcon, ArrowTrendingUpIcon, SparklesIcon, CheckIcon } from '@heroicons/react/24/solid';

// Data for the plans
const plans = [
    {
        level: 'Nivel 1',
        title: 'Aprendiz de Semilla',
        icon: <AcademicCapIcon className="h-6 w-6 text-brand-green" />,
        description: 'El inicio de tu siembra.',
        price: 'Gratis',
        features: [
            {
                name: 'Estudio Sencillo y Práctico',
                description: 'Acceso a orientación básica para el uso del préstamo y la maximización de retornos agrícolas.'
            },
            {
                name: 'Observación de Mercado',
                description: 'Consulta los costos actuales del mercado en la canasta familiar.'
            },
            {
                name: 'Impacto Social',
                description: 'Al crear tu cuenta de ahorros, ayudas a los campesinos cundiboyacenses a impulsar el sector.'
            }
        ],
        buttonText: 'Empieza Gratis',
        highlight: false,
    },
    {
        level: 'Nivel 2: CULTIVADOR PLUS',
        title: 'Suscripción de Cultivador Plus',
        icon: <ArrowTrendingUpIcon className="h-6 w-6 text-brand-green" />,
        description: 'Mejora tus técnicas y herramientas.',
        price: '$29.900',
        features: [
            {
                name: 'Estudio Detallado y Práctico',
                description: 'Análisis detallado y orientación avanzada para maximizar tus retornos agrícolas y el uso óptimo del préstamo.'
            },
            {
                name: 'Descuentos en Productos Básicos',
                description: 'Descuentos aplicables en productos esenciales para reducir costos operativos y aumentar tu capacidad de inversión.'
            },
            {
                name: 'Impacto Social Plus',
                description: 'Tu suscripción genera un impacto social mayor para impulsar el sector.'
            }
        ],
        buttonText: 'Suscribirme a Plus',
        highlight: true,
    },
    {
        level: 'Nivel 3: MAESTRO DE COSECHA',
        title: 'Suscripción de Maestro de Cosecha',
        icon: <SparklesIcon className="h-6 w-6 text-yellow-500" />,
        description: 'Alcanza el máximo rendimiento.',
        price: '$59.900',
        features: [
            {
                name: 'Créditos con Tasas Preferenciales',
                description: 'Facilidad de acceso a créditos con condiciones exclusivas para suscriptores.'
            },
            {
                name: 'Soporte Técnico Integral',
                description: 'Acceso directo a agrónomos, asesores financieros y seguros para mitigar riesgos.'
            },
            {
                name: 'Seguro de Préstamo con Ahorro',
                description: 'El seguro se acumula como un ahorro por tu suscripción, creciendo con el tiempo.'
            },
            {
                name: 'Creador de Oportunidades',
                description: 'Tu suscripción contribuye a crear una cuenta de ahorros que beneficia directamente a los campesinos.'
            }
        ],
        buttonText: 'Suscribirme a Maestro',
        highlight: false,
    },
];

const FeatureItem: React.FC<{ name: string; description: string }> = ({ name, description }) => (
    <div>
        <div className="flex items-start">
            <CheckIcon className="h-5 w-5 text-brand-green flex-shrink-0 mt-1 mr-2" />
            <div>
                <p className="font-semibold text-brand-dark font-heading">{name}</p>
                <p className="text-sm text-slate-600 mt-1">{description}</p>
            </div>
        </div>
    </div>
);


const SubscriptionPlanCard: React.FC<{ plan: typeof plans[0] }> = ({ plan }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg flex flex-col transition-all duration-300 ${plan.highlight ? 'border-2 border-brand-green scale-105' : 'border border-slate-200'}`}>
        <div className="flex items-center gap-3 mb-2">
            {plan.icon}
            <h3 className="font-bold text-slate-600 uppercase tracking-wide font-heading">{plan.level}</h3>
        </div>
        <h4 className="text-xl font-bold text-brand-dark font-heading">{plan.title}</h4>
        <p className="text-slate-500 mt-1 mb-4">{plan.description}</p>
        
        <div className="text-center my-4">
            <span className="text-4xl font-extrabold text-brand-dark font-heading">{plan.price}</span>
            {plan.price !== 'Gratis' && <span className="text-slate-500">/mes</span>}
        </div>
        
        <hr className="my-4 border-slate-200" />
        
        <div className="space-y-4 flex-grow mb-6">
            {plan.features.map(feature => (
                <FeatureItem key={feature.name} name={feature.name} description={feature.description} />
            ))}
        </div>
        
        <button className={`mt-auto w-full font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 font-heading ${plan.highlight ? 'bg-gradient-to-r from-brand-green to-brand-gold hover:from-brand-green-dark hover:to-brand-gold-dark text-white hover:shadow-xl shadow-lg [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]' : 'bg-slate-100 text-brand-dark hover:bg-slate-200 shadow-md hover:shadow-lg'}`}>
            {plan.buttonText}
        </button>
    </div>
);


const PlansPage: React.FC = () => {
  return (
    <div className="bg-brand-beige py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark animate-fadeIn font-heading">
            🌱 ¡Elige tu Plan de Crecimiento Agrícola!
          </h1>
          <p className="text-lg text-gray-700 mt-4 max-w-3xl mx-auto animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Selecciona el nivel de suscripción que mejor se adapta a tus metas y maximiza los retornos de tu agrocampo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            {plans.map(plan => (
                <SubscriptionPlanCard key={plan.level} plan={plan} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default PlansPage;