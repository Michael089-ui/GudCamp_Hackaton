

import React from 'react';
import { CreditSimulation, CropType } from '../types';
import FinancialAdvisory from './FinancialAdvisory';
import { 
    CalculatorIcon, 
    BanknotesIcon, 
    ReceiptPercentIcon, 
    ChartPieIcon, 
    ScaleIcon 
} from '@heroicons/react/24/outline';

interface SimulationInput {
    amount: number;
    interestRate: number;
    term: number;
    cropType: CropType;
    customCropName: string;
    hectares: number;
    arrobas: number;
}

interface SimulationResultsProps {
    isDirty: boolean;
    result: CreditSimulation | null;
    simulationInput: SimulationInput;
    showSavedMessage: boolean;
    onSave: () => void;
    onReset: () => void;
}

const StatDisplay: React.FC<{ icon: React.ReactNode; label: string; value: string; colorClass: string; }> = ({ icon, label, value, colorClass }) => (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-white ${colorClass}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-500 font-heading">{label}</p>
                <p className={`text-2xl font-bold ${colorClass} font-heading`}>{value}</p>
            </div>
        </div>
    </div>
);

const ProgressBar: React.FC<{ principal: number; interest: number }> = ({ principal, interest }) => {
    const total = principal + interest;
    if (total === 0) return null; // Avoid division by zero
    
    const principalPercent = (principal / total) * 100;
    const interestPercent = (interest / total) * 100;

    return (
        <div className="mt-4">
            <div className="flex h-4 overflow-hidden rounded-full bg-slate-200 text-xs font-heading">
                <div style={{ width: `${principalPercent}%` }} className="flex flex-col justify-center whitespace-nowrap bg-brand-green text-white shadow-none text-center">
                    {principalPercent > 10 && `Capital`}
                </div>
                <div style={{ width: `${interestPercent}%` }} className="flex flex-col justify-center whitespace-nowrap bg-brand-brown text-white shadow-none text-center">
                    {interestPercent > 10 && `Interés`}
                </div>
            </div>
            <div className="flex justify-between text-sm mt-2">
                <p><span className="font-bold text-brand-green">{principalPercent.toFixed(1)}%</span> Capital</p>
                <p><span className="font-bold text-brand-brown">{interestPercent.toFixed(1)}%</span> Interés</p>
            </div>
        </div>
    );
};

const SimulationResults: React.FC<SimulationResultsProps> = ({ isDirty, result, simulationInput, showSavedMessage, onSave, onReset }) => {
    
    // Initial placeholder state
    if (!isDirty && !result) {
        return (
            <div className="bg-slate-50 p-8 rounded-xl shadow-inner border-2 border-dashed border-slate-300 flex flex-col items-center justify-center h-full text-center text-slate-500 animate-fadeIn">
                <CalculatorIcon className="h-16 w-16 text-slate-400 mb-4" />
                <h3 className="font-semibold text-lg text-slate-700 mb-2 font-heading">Proyecta tu crédito agrícola</h3>
                <p>Ingresa los datos en el formulario para ver una simulación detallada.</p>
            </div>
        );
    }

    // Calculated results state
    if (result) {
        const totalToPay = result.amount + result.totalInterest;
        return (
            <div className="bg-white p-8 rounded-xl shadow-lg animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-brand-dark font-heading">Resultados de la Simulación</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <StatDisplay
                        icon={<BanknotesIcon className="h-6 w-6" />}
                        label="Cuota Mensual"
                        value={result.monthlyPayment.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        colorClass="text-brand-green"
                    />
                     <StatDisplay
                        icon={<ReceiptPercentIcon className="h-6 w-6" />}
                        label="Tasa de Interés"
                        value={`${result.interestRate}%`}
                        colorClass="text-sky-500"
                    />
                    <StatDisplay
                        icon={<ChartPieIcon className="h-6 w-6" />}
                        label="Intereses Totales"
                        value={result.totalInterest.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        colorClass="text-brand-brown"
                    />
                     <StatDisplay
                        icon={<ScaleIcon className="h-6 w-6" />}
                        label="Monto Total a Pagar"
                        value={totalToPay.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        colorClass="text-slate-800"
                    />
                </div>

                <div>
                    <h3 className="font-bold text-slate-700 mb-2 font-heading">Composición del Crédito</h3>
                    <ProgressBar principal={result.amount} interest={result.totalInterest} />
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-8">
                    <button onClick={onSave} className="flex-1 bg-gradient-to-r from-brand-green to-brand-gold hover:from-brand-green-dark hover:to-brand-gold-dark text-white font-bold py-3 rounded-xl transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] font-heading">Guardar Simulación</button>
                    <button onClick={onReset} className="flex-1 bg-slate-100 text-brand-dark font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors duration-300 font-heading shadow-md hover:shadow-lg transform hover:scale-105">Simular Otro Crédito</button>
                </div>
                {showSavedMessage && <p className="text-green-600 mt-4 text-center font-semibold animate-fadeIn">¡Simulación guardada con éxito!</p>}
                
                <FinancialAdvisory
                    amount={result.amount}
                    interestRate={result.interestRate}
                    term={result.term}
                    monthlyPayment={result.monthlyPayment}
                    cropType={result.cropType}
                    hectares={simulationInput.hectares}
                    arrobas={simulationInput.arrobas}
                />
            </div>
        );
    }
    
    // Summary of inputs state (dirty form, no results yet)
    return (
         <div className="bg-white p-8 rounded-xl shadow-lg h-full flex flex-col animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 text-brand-dark font-heading">Resumen de Datos</h2>
            <p className="text-slate-500 mb-6">Revisa los datos y haz clic en 'Calcular' para obtener tu proyección.</p>
            <div className="space-y-3 text-slate-700 flex-grow">
                <div className="flex justify-between items-center py-2 border-b border-slate-100"><span className="font-medium">Monto del Crédito:</span> <span className="font-bold text-brand-dark font-heading">{simulationInput.amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</span></div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100"><span className="font-medium">Cultivo:</span> <span className="font-bold text-brand-dark font-heading">{simulationInput.cropType === CropType.Otro ? simulationInput.customCropName || '...' : simulationInput.cropType}</span></div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100"><span className="font-medium">Hectáreas:</span> <span className="font-bold text-brand-dark font-heading">{simulationInput.hectares} ha</span></div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100"><span className="font-medium">Arrobas/mes:</span> <span className="font-bold text-brand-dark font-heading">{simulationInput.arrobas}</span></div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100"><span className="font-medium">Tasa Sugerida:</span> <span className="font-bold text-brand-dark font-heading">{simulationInput.interestRate}% mensual</span></div>
                <div className="flex justify-between items-center py-2"><span className="font-medium">Plazo:</span> <span className="font-bold text-brand-dark font-heading">{simulationInput.term} meses</span></div>
            </div>
            <div className="mt-auto pt-6 border-t border-slate-200 text-center">
                 <div className="animate-pulse font-semibold text-brand-green font-heading">
                    ↓ Haz clic en Calcular para continuar ↓
                 </div>
            </div>
        </div>
    );
};

export default SimulationResults;