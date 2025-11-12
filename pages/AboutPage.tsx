

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CalculatorIcon, 
  LightBulbIcon, 
  UsersIcon, 
  GlobeAltIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Feature: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-brand-green-light text-brand-green flex items-center justify-center">
      {icon}
    </div>
    <div className="ml-4">
      <h3 className="text-lg font-bold text-brand-dark font-heading">{title}</h3>
      <p className="mt-1 text-gray-600">{children}</p>
    </div>
  </div>
);

const AboutPage: React.FC = () => {
  return (
    <div className="bg-brand-beige">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark leading-tight animate-fadeIn font-heading">
          Nuestra misión: <span className="inline-block bg-gradient-to-r from-brand-green to-brand-gold bg-clip-text text-transparent">Sembrar futuro</span> en el campo colombiano.
        </h1>
        <p className="mt-6 text-lg max-w-3xl mx-auto text-gray-700 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          Creemos en el poder de la tierra y en la dedicación de quienes la trabajan. Nacimos para ser el puente entre los agricultores y el futuro financiero que merecen, ofreciendo herramientas de crédito agrícola accesibles, justas y transparentes.
        </p>
      </div>

      {/* Main Content with Image */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fadeIn">
            <img 
              src="https://i.ibb.co/HfKY8xV4/GudCamp.jpg" 
              alt="Logo de GodCamp"
              className="rounded-2xl shadow-2xl w-full h-96 object-contain bg-white p-4" 
            />
          </div>
          <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl font-bold text-brand-dark mb-6 font-heading">¿Por qué elegirnos?</h2>
            <div className="space-y-6">
              <Feature icon={<LightBulbIcon className="h-6 w-6" />} title="Tecnología al servicio del agro">
                Simplificamos el acceso a créditos agrícolas. Nuestra plataforma digital te permite simular, planificar y entender tus finanzas sin burocracia.
              </Feature>
              <Feature icon={<UsersIcon className="h-6 w-6" />} title="Un aliado para tu crecimiento">
                Más que una fintech, somos un equipo comprometido con tu éxito. Ofrecemos asesoría y planes financieros diseñados para las necesidades reales del campo.
              </Feature>
              <Feature icon={<GlobeAltIcon className="h-6 w-6" />} title="Transparencia y confianza">
                Operamos con claridad y honestidad. Con nosotros, siempre sabrás las condiciones de tu crédito, sin costos ocultos ni sorpresas.
              </Feature>
            </div>
          </div>
        </div>
      </div>
      
      {/* Impact Story */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center bg-brand-green-light p-10 rounded-xl border border-brand-green relative">
             <span className="absolute -top-5 -left-5 h-16 w-16 bg-brand-dark text-white flex items-center justify-center rounded-full text-4xl font-serif shadow-lg">“</span>
            <blockquote className="text-xl italic text-brand-dark leading-relaxed z-10 relative">
              "Gracias al Mercado Agropecuario, pude comprar las semillas de café a tiempo. La calculadora me dio la confianza que necesitaba para solicitar el crédito y planificar la temporada. ¡Mi cosecha fue un éxito!"
            </blockquote>
            <cite className="block font-bold text-brand-green mt-6 not-italic font-heading">
              - Lucía Hernandez, Caficultora de Caldas
            </cite>
          </div>
        </div>
      </div>


      {/* Final CTA Section */}
      <div className="container mx-auto px-6 py-20 text-center">
         <h2 className="text-3xl font-bold text-brand-dark mb-4 font-heading">Conectamos a los campesinos con el futuro financiero</h2>
         <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            ¿Estás listo para dar el siguiente paso? Descubre cómo nuestras herramientas pueden ayudarte a alcanzar tus metas.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            to="/calculator"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-green to-brand-gold hover:from-brand-green-dark hover:to-brand-gold-dark text-white font-bold py-3 px-8 rounded-xl text-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] font-heading"
          >
            <CalculatorIcon className="h-6 w-6" />
            Prueba la Calculadora
          </Link>
          <Link 
            to="/plans"
            className="inline-flex items-center gap-2 bg-white text-brand-green font-bold py-3 px-8 rounded-xl text-lg hover:bg-brand-green/10 transition-all duration-300 transform hover:scale-105 border-2 border-brand-green font-heading shadow-md hover:shadow-lg"
          >
            Ver Planes Financieros <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;