

import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Application, ApplicationStatus, CreditStatus, CropType, PlanType, ProductType } from '../../types';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

const formatApplicationDetails = (app: Application): React.ReactNode => {
    const details = app.details;
    const detailItems: {label: string, value: any}[] = [];

    switch (app.productType) {
        case ProductType.Credit:
            detailItems.push({ label: 'Monto', value: (details.amount as number)?.toLocaleString('es-CO', {style:'currency', currency:'COP', minimumFractionDigits: 0}) });
            detailItems.push({ label: 'Plazo', value: `${details.term} meses` });
            detailItems.push({ label: 'Cultivo', value: details.cropType === CropType.Otro ? details.customCropName : details.cropType });
            detailItems.push({ label: 'Propósito', value: details.purpose });
            break;
        case ProductType.Insurance:
            detailItems.push({ label: 'Cobertura', value: (details.coverage as number)?.toLocaleString('es-CO', {style:'currency', currency:'COP', minimumFractionDigits: 0}) });
            detailItems.push({ label: 'Tipo', value: details.insuranceType });
            break;
        case ProductType.SavingsAccount:
            detailItems.push({ label: 'Depósito', value: (details.initialDeposit as number)?.toLocaleString('es-CO', {style:'currency', currency:'COP', minimumFractionDigits: 0}) });
            break;
        default:
            return 'N/A';
    }

    return (
        <ul className="space-y-1 text-xs">
            {detailItems.map(item => item.value && (
                <li key={item.label}>
                    <span className="font-semibold">{item.label}:</span> {item.value}
                </li>
            ))}
        </ul>
    );
}

const ApplicationsPage: React.FC = () => {
    const { 
        applications, setApplications, 
        users, 
        setCredits, 
        setSavingsAccounts,
        setInsurances
    } = useData();
    const [filterStatus, setFilterStatus] = useState<string>('All');

    const userMap = useMemo(() => new Map(users.map(u => [u.id, u.name])), [users]);

    const filteredApplications = useMemo(() => {
        return applications
            .filter(app => filterStatus === 'All' || app.status === filterStatus)
            .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());
    }, [applications, filterStatus]);

    const handleDecision = (appId: string, newStatus: ApplicationStatus) => {
        const today = new Date().toISOString().split('T')[0];
        let approvedApp: Application | undefined;

        setApplications(apps => apps.map(app => {
            if (app.id === appId) {
                const updatedApp = { ...app, status: newStatus, decisionDate: today };
                if (newStatus === ApplicationStatus.Approved) {
                    approvedApp = updatedApp;
                }
                return updatedApp;
            }
            return app;
        }));
        
        // If approved, create the corresponding product
        if (approvedApp) {
            switch(approvedApp.productType) {
                case ProductType.Credit:
                    const { amount, term, cropType, customCropName } = approvedApp.details;
                    // Simplified calculation for demo purposes
                    const interestRate = 1.8;
                    const monthlyRate = interestRate / 100;
                    const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
                    const totalInterest = (monthlyPayment * term) - amount;

                    setCredits(prev => [...prev, {
                        id: `credit-${Date.now()}`,
                        userId: approvedApp!.userId,
                        amount,
                        term,
                        interestRate,
                        monthlyPayment,
                        totalInterest,
                        cropType: cropType || CropType.Otro,
                        customCropName: cropType === CropType.Otro ? customCropName : undefined,
                        status: CreditStatus.Active,
                        simulationDate: today,
                        plan: PlanType.Semilla // Default plan
                    }]);
                    break;
                case ProductType.SavingsAccount:
                    setSavingsAccounts(prev => [...prev, {
                        id: `sa-${Date.now()}`,
                        userId: approvedApp!.userId,
                        accountNumber: Math.random().toString().slice(2, 12),
                        balance: approvedApp!.details.initialDeposit || 0,
                        openedDate: today
                    }]);
                    break;
                case ProductType.Insurance:
                    setInsurances(prev => [...prev, {
                        id: `ins-${Date.now()}`,
                        userId: approvedApp!.userId,
                        policyNumber: `POL-${Date.now()}`,
                        type: approvedApp!.details.insuranceType,
                        coverage: approvedApp!.details.coverage,
                        // FIX: Cast premium to a number as expected by the Insurance type. .toFixed() returns a string.
                        premium: Number((approvedApp!.details.coverage * 0.05).toFixed(0)), // Simplified premium
                        startDate: today,
                        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
                    }]);
                    break;
            }
        }
    };
    
    const getStatusBadge = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.Approved:
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 font-heading"><CheckCircleIcon className="h-3.5 w-3.5"/>{status}</span>;
            case ApplicationStatus.Rejected:
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 font-heading"><XCircleIcon className="h-3.5 w-3.5"/>{status}</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 font-heading"><ClockIcon className="h-3.5 w-3.5"/>{status}</span>;
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-6 font-heading">Gestión de Solicitudes</h1>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
                <label htmlFor="statusFilter" className="block text-sm font-medium text-slate-700 mb-1 font-heading">Filtrar por Estado</label>
                <select id="statusFilter" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-48 p-2 border rounded-md border-slate-300 bg-white">
                    <option value="All">Todas</option>
                    {Object.values(ApplicationStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Usuario</th>
                            <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Producto</th>
                            <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Detalles</th>
                            <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Fecha Solicitud</th>
                            <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Estado</th>
                            <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {filteredApplications.map(app => (
                            <tr key={app.id}>
                                <td className="py-3 px-4 font-medium">{userMap.get(app.userId) || 'Usuario no encontrado'}</td>
                                <td className="py-3 px-4 font-heading">{app.productType}</td>
                                <td className="py-3 px-4 text-slate-500">
                                    {formatApplicationDetails(app)}
                                </td>
                                <td className="py-3 px-4 text-slate-500">{app.applicationDate}</td>
                                <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                                <td className="py-3 px-4">
                                    {app.status === ApplicationStatus.Pending && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleDecision(app.id, ApplicationStatus.Approved)} className="font-semibold text-green-600 hover:underline font-heading">Aprobar</button>
                                            <button onClick={() => handleDecision(app.id, ApplicationStatus.Rejected)} className="font-semibold text-red-600 hover:underline font-heading">Rechazar</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApplicationsPage;