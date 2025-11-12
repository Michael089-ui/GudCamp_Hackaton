

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CreditSimulation, AmortizationEntry } from '../types';
import { SparklesIcon, CurrencyDollarIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';

interface AmortizationChartProps {
  result: CreditSimulation;
  data: AmortizationEntry[];
  hectares: number;
  arrobas: number;
}

const COLORS = {
    'Tu Deuda': '#6DBE45', // brand-green
    'Costo del Préstamo': '#E3C341', // brand-gold
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const principal = payload.find(p => p.dataKey === 'principal')?.value || 0;
    const interest = payload.find(p => p.dataKey === 'interest')?.value || 0;
    const isPayingMorePrincipal = principal > interest;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
        <p className="font-bold font-heading text-slate-700">{`Mes ${label}`}</p>
        <p style={{ color: COLORS['Tu Deuda'] }}>{`Abono a tu deuda: ${principal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`}</p>
        <p style={{ color: COLORS['Costo del Préstamo'] }}>{`Costo del préstamo: ${interest.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`}</p>
        {isPayingMorePrincipal && <p className="text-xs mt-2 text-green-700">🪴 ¡Bien! Estás pagando más a tu deuda este mes.</p>}
      </div>
    );
  }
  return null;
};

const NarrativeAnalysis: React.FC<{ hectares: number; arrobas: number; term: number; totalInterest: number; amount: number }> = ({ hectares, arrobas, term, totalInterest, amount }) => {
    const productivity = hectares > 0 ? (arrobas / hectares).toFixed(1) : 0;
    const interestRatio = (totalInterest / amount * 100).toFixed(0);

    return (
        <div className="mt-12 bg-brand-green-light p-6 rounded-xl border-2 border-dashed border-brand-green animate-fadeIn">
            <div className="flex items-start gap-4">
                <div className="text-brand-green flex-shrink-0">
                    <SparklesIcon className="h-10 w-10"/>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-brand-dark font-heading">Tu Análisis Personalizado</h3>
                    <p className="mt-2 text-slate-700">
                        Con una producción de <strong>{arrobas} arrobas</strong> en <strong>{hectares} hectáreas</strong> (una productividad de {productivity} arr/ha), 
                        tu crédito se pagará en <strong>{term} meses</strong>. El costo total del préstamo será de <strong>{interestRatio}%</strong> sobre el monto que pediste.
                        <span className="block mt-2 font-semibold text-brand-green">¡Sigue planificando para que tu cosecha sea un éxito!</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

const AmortizationChart: React.FC<AmortizationChartProps> = ({ result, data, hectares, arrobas }) => {
    const { amount, totalInterest, term, monthlyPayment } = result;
    const totalPayment = amount + totalInterest;

    const pieData = [
        { name: 'Tu Deuda', value: amount },
        { name: 'Costo del Préstamo', value: totalInterest },
    ];
    
    const isHealthyCredit = totalInterest < amount * 0.4; // Threshold for "healthy" credit

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg mt-8 animate-fadeIn">
            <h2 className="text-3xl font-bold mb-6 text-brand-dark font-heading text-center">Entendiendo tu Crédito del Campo</h2>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Donut Chart */}
                <div>
                    <h3 className="text-lg font-semibold text-center text-slate-700 mb-4 font-heading">¿Cómo se divide tu pago total?</h3>
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    isAnimationActive={true}
                                    animationDuration={800}
                                >
                                    {pieData.map((entry) => (
                                        <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <p className="text-sm text-slate-500">Pagarás en total</p>
                            <p className="text-3xl font-bold text-brand-dark font-heading">
                                {totalPayment.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                     <h3 className="text-lg font-semibold text-slate-700 mb-4 font-heading">Tu Resumen en simple</h3>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-brand-green-light rounded-full text-brand-green"><CurrencyDollarIcon className="h-8 w-8"/></div>
                            <div>
                                <p className="text-sm text-slate-600">Pagas esto cada mes</p>
                                <p className="font-bold text-2xl text-brand-dark font-heading">{monthlyPayment.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-brand-green-light rounded-full text-brand-green"><CalendarDaysIcon className="h-8 w-8"/></div>
                            <div>
                                <p className="text-sm text-slate-600">Durante este tiempo</p>
                                <p className="font-bold text-2xl text-brand-dark font-heading">{term} Meses</p>
                            </div>
                        </div>
                    </div>
                    {isHealthyCredit && (
                        <div className="mt-4 text-center bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-lg text-sm font-heading">
                           👍 ¡Es un crédito saludable!
                        </div>
                    )}
                </div>
            </div>

            {/* Bar Chart */}
            <div className="mt-12">
                <h3 className="text-lg font-semibold text-center text-slate-700 mb-4 font-heading">Así baja tu deuda cada mes</h3>
                <p className="text-center text-sm text-slate-500 max-w-2xl mx-auto mb-6">
                    Mira cómo cada pago se divide. Al principio pagas más por el costo del préstamo (dorado), pero con el tiempo, la mayor parte de tu pago va a reducir tu deuda (verde).
                </p>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="month" stroke="#64748b" fontSize={12} unit="m" />
                            <YAxis 
                                stroke="#64748b" 
                                fontSize={12} 
                                tickFormatter={(value: number) => value.toLocaleString('es-CO', { notation: 'compact', compactDisplay: 'short' })}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                            <Legend formatter={(value) => value === 'principal' ? 'Abono a tu deuda' : 'Costo del préstamo'} />
                            <Bar dataKey="principal" name="principal" stackId="a" fill={COLORS['Tu Deuda']} isAnimationActive={true} animationDuration={800} />
                            <Bar dataKey="interest" name="interest" stackId="a" fill={COLORS['Costo del Préstamo']} radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={800} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Narrative Analysis */}
            <NarrativeAnalysis 
                hectares={hectares}
                arrobas={arrobas}
                term={term}
                totalInterest={totalInterest}
                amount={amount}
            />
        </div>
    );
};

export default AmortizationChart;