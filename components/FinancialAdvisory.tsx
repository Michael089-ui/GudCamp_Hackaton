

import React from 'react';
import { Link } from 'react-router-dom';
import { LightBulbIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { CropType } from '../types';

interface AdvisoryProps {
  amount: number;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  cropType: CropType;
  hectares: number;
  arrobas: number;
}

const AdvisoryMessage: React.FC<{ icon: React.ReactNode; type: 'Consejo' | 'Recomendación'; children: React.ReactNode; actionButton?: React.ReactNode }> = ({ icon, type, children, actionButton }) => (
  <div className="flex items-start p-4 rounded-xl bg-slate-100 border border-slate-200 mt-4 animate-fadeIn">
    <div className="flex-shrink-0 text-brand-green">{icon}</div>
    <div className="ml-3">
      <h4 className="font-bold text-slate-800 font-heading">{type}</h4>
      <p className="text-sm text-slate-600">{children}</p>
      {actionButton && <div className="mt-3">{actionButton}</div>}
    </div>
  </div>
);

const FinancialAdvisory: React.FC<AdvisoryProps> = ({ amount, interestRate, term, monthlyPayment, cropType, hectares, arrobas }) => {
  const getAdvice = () => {
     const viewPlansButton = (
        <Link to="/plans" className="inline-block bg-gradient-to-r from-brand-green to-brand-gold hover:from-brand-green-dark hover:to-brand-gold-dark text-white text-sm font-bold py-2 px-4 rounded-xl transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] font-heading">
            Conocer Nuestros Planes
        </Link>
    );

    // Priority 1: High Interest Rate (Warning)
    if (interestRate > 2.5) {
      return (
        <AdvisoryMessage icon={<ExclamationTriangleIcon className="h-6 w-6" />} type="Recomendación">
          Tu tasa de interés es alta ({interestRate}%). Considera mejorar tus datos de producción para acceder a una mejor tasa o busca otras opciones de financiación.
        </AdvisoryMessage>
      );
    }

    // Priority 2: High Monthly Payment
    if (monthlyPayment > 2000000 && term < 48) {
      return (
        <AdvisoryMessage icon={<LightBulbIcon className="h-6 w-6" />} type="Consejo">
          Tu cuota mensual es elevada. Te recomendamos un plazo más largo para que la cuota sea más baja y puedas manejarla con mayor comodidad.
        </AdvisoryMessage>
      );
    }
    
    // Priority 3: Very Long Term (High total interest)
    if (term >= 48) {
      return (
        <AdvisoryMessage icon={<LightBulbIcon className="h-6 w-6" />} type="Consejo">
            Con un plazo de {term} meses, pagarás una cantidad considerable en intereses. Si tus finanzas lo permiten, considera reducir el plazo para ahorrar dinero a largo plazo.
        </AdvisoryMessage>
      );
    }
    
    // Priority 4: Productivity
    const productivity = hectares > 0 ? arrobas / hectares : 0;
    if (hectares > 1 && productivity < 4) {
      return (
        <AdvisoryMessage icon={<LightBulbIcon className="h-6 w-6" />} type="Consejo" actionButton={viewPlansButton}>
          Tu productividad ({productivity.toFixed(1)} arrobas/hectárea) tiene potencial de mejora. El <strong>Plan Cosecha</strong> incluye acompañamiento educativo que podría ayudarte a optimizar tu rendimiento.
        </AdvisoryMessage>
      );
    }
    
    // Priority 5: Specific Plan Recommendations
    if (amount > 15000000) {
        return (
            <AdvisoryMessage icon={<LightBulbIcon className="h-6 w-6" />} type="Consejo" actionButton={viewPlansButton}>
                Este monto es ideal para el <strong>Plan Raíz</strong>, que está diseñado para grandes inversiones y ofrece asesoría personalizada y plazos extendidos.
            </AdvisoryMessage>
        );
    }
    
    if (amount <= 3000000 && amount >= 500000) {
      return (
        <AdvisoryMessage icon={<LightBulbIcon className="h-6 w-6" />} type="Consejo" actionButton={viewPlansButton}>
          Este monto es ideal para el <strong>Plan Semilla</strong>, que ofrece microcréditos con tasas preferenciales y procesos ágiles para necesidades puntuales como la compra de insumos.
        </AdvisoryMessage>
      );
    }

    // Default message if no specific advice is triggered
    return (
        <AdvisoryMessage icon={<LightBulbIcon className="h-6 w-6" />} type="Consejo" actionButton={viewPlansButton}>
            Tu simulación se ve bien. Recuerda que el <strong>Plan Cosecha</strong> es ideal para montos intermedios y ofrece acompañamiento para optimizar tu producción.
        </AdvisoryMessage>
    );
  };

  const advice = getAdvice();

  return advice ? <div className="mt-6">{advice}</div> : null;
};

export default FinancialAdvisory;