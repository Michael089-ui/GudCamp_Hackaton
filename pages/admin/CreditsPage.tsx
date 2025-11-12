

import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { CreditSimulation, CropType, CreditStatus } from '../../types';

const CreditsPage: React.FC = () => {
  const { credits, setCredits } = useData();
  const [filterCrop, setFilterCrop] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredCredits = useMemo(() => {
    return credits
      .filter(credit => {
        const cropMatch = filterCrop === 'All' || credit.cropType === filterCrop;
        const statusMatch = filterStatus === 'All' || credit.status === filterStatus;
        return cropMatch && statusMatch;
      })
      .sort((a, b) => new Date(b.simulationDate).getTime() - new Date(a.simulationDate).getTime());
  }, [credits, filterCrop, filterStatus]);

  const handleDeleteCredit = (creditId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este registro de crédito?')) {
        setCredits(credits.filter(c => c.id !== creditId));
    }
  };
  
  const getStatusBadgeClass = (status: CreditStatus) => {
    switch(status) {
        case CreditStatus.Active: return 'bg-green-100 text-green-800';
        case CreditStatus.Simulated: return 'bg-yellow-100 text-yellow-800';
        case CreditStatus.Paid: return 'bg-blue-100 text-blue-800';
        default: return 'bg-slate-100 text-slate-800';
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6 font-heading">Gestión de Créditos</h1>
      
      {/* Filter Card */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <label htmlFor="cropFilter" className="block text-sm font-medium text-slate-700 mb-1 font-heading">Filtrar por Cultivo</label>
            <select id="cropFilter" value={filterCrop} onChange={e => setFilterCrop(e.target.value)} className="w-48 p-2 border rounded-md border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-green">
              <option value="All">Todos</option>
              {Object.values(CropType).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-slate-700 mb-1 font-heading">Filtrar por Estado</label>
            <select id="statusFilter" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-48 p-2 border rounded-md border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-green">
              <option value="All">Todos</option>
              {Object.values(CreditStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>
      
      {/* Table Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
         <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Monto</th>
                        <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Cultivo</th>
                        <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Plan</th>
                        <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Tasa Mensual</th>
                        <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Plazo (meses)</th>
                        <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Cuota Mensual</th>
                        <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Estado</th>
                        <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Fecha Simulación</th>
                        <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {filteredCredits.map(credit => (
                        <tr key={credit.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 text-slate-800 font-medium">{credit.amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                            <td className="py-3 px-4 text-slate-500">{credit.cropType}</td>
                            <td className="py-3 px-4 text-slate-500 font-medium">{credit.plan || 'N/A'}</td>
                            <td className="py-3 px-4 text-slate-500">{credit.interestRate}%</td>
                            <td className="py-3 px-4 text-slate-500">{credit.term}</td>
                            <td className="py-3 px-4 text-slate-500">{credit.monthlyPayment.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                            <td className="py-3 px-4">
                                <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(credit.status)} font-heading`}>
                                    {credit.status}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500">{credit.simulationDate}</td>
                            <td className="py-3 px-4">
                                <button onClick={() => handleDeleteCredit(credit.id)} className="font-semibold text-red-500 hover:underline font-heading">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;