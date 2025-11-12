

import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Application, CreditSimulation, Insurance, ProductType, SavingsAccount, ApplicationStatus, CropType } from '../../types';
import ApplicationFormModal from '../../components/ApplicationFormModal';
import { BanknotesIcon, BuildingLibraryIcon, ShieldCheckIcon, BuildingOffice2Icon, CurrencyDollarIcon, PlusCircleIcon, DocumentTextIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

// FIX: Removed the unused 'data' prop from the component's props type definition.
const ProductCard: React.FC<{ title: string, icon: React.ReactNode, details: [string, string][] }> = ({ title, icon, details }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col">
        <div className="flex items-center mb-4">
            <div className="p-3 bg-brand-green-light text-brand-green rounded-xl mr-4">{icon}</div>
            <h3 className="text-xl font-bold text-brand-dark font-heading">{title}</h3>
        </div>
        <div className="space-y-2 text-sm text-slate-600 flex-grow">
            {details.map(([key, value]) => (
                <div key={key} className="flex justify-between">
                    <span className="font-heading">{key}:</span>
                    <span className="font-semibold text-slate-800">{value}</span>
                </div>
            ))}
        </div>
        <button className="mt-6 text-sm w-full text-center bg-slate-100 text-brand-dark font-bold py-2 px-4 rounded-xl hover:bg-slate-200 transition-all duration-300 shadow-sm hover:shadow-md font-heading">
            Ver detalles
        </button>
    </div>
);

const RequestButton: React.FC<{ title: string, onClick: () => void, icon: React.ReactNode, iconClasses?: string }> = ({ title, onClick, icon, iconClasses }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:border-brand-green hover:shadow-lg transition-all text-center flex flex-col items-center justify-center">
        <div className={`p-3 rounded-xl mb-3 ${iconClasses || 'bg-brand-blue text-sky-500'}`}>{icon}</div>
        <span className="font-bold text-brand-dark font-heading">{title}</span>
    </button>
);

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

const formatApplicationDetails = (app: Application): string => {
    const details = app.details;
    switch (app.productType) {
        case ProductType.Credit:
            const amount = details.amount ? (details.amount as number).toLocaleString('es-CO', {style:'currency', currency:'COP', minimumFractionDigits: 0}) : 'N/A';
            const term = details.term ? `${details.term} meses` : 'N/A';
            const crop = details.cropType === CropType.Otro ? details.customCropName : details.cropType;
            return `Monto: ${amount}, Plazo: ${term}, Cultivo: ${crop}`;
        case ProductType.Insurance:
            const coverage = details.coverage ? (details.coverage as number).toLocaleString('es-CO', {style:'currency', currency:'COP', minimumFractionDigits: 0}) : 'N/A';
            return `Cobertura: ${coverage}, Tipo: ${details.insuranceType}`;
        case ProductType.SavingsAccount:
            const deposit = details.initialDeposit ? (details.initialDeposit as number).toLocaleString('es-CO', {style:'currency', currency:'COP', minimumFractionDigits: 0}) : 'N/A';
            return `Depósito Inicial: ${deposit}`;
        default:
            return 'Detalles no disponibles';
    }
}

const UserDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { credits, savingsAccounts, insurances, applications, setApplications } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const userProducts = useMemo(() => ({
    credits: credits.filter(c => c.userId === currentUser?.id),
    savings: savingsAccounts.filter(s => s.userId === currentUser?.id),
    insurances: insurances.filter(i => i.userId === currentUser?.id),
    applications: applications.filter(a => a.userId === currentUser?.id).sort((a,b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()),
  }), [currentUser, credits, savingsAccounts, insurances, applications]);
  
  const handleRequestProduct = (productType: ProductType) => {
    setSelectedProduct(productType);
    setIsModalOpen(true);
  };
  
  const handleApplicationSubmit = (details: Record<string, any>) => {
    if (currentUser && selectedProduct) {
        const newApplication: Application = {
            id: `app-${Date.now()}`,
            userId: currentUser.id,
            productType: selectedProduct,
            status: ApplicationStatus.Pending,
            details: details,
            applicationDate: new Date().toISOString().split('T')[0],
        };
        setApplications(prev => [newApplication, ...prev]);
        setIsModalOpen(false);
        setSelectedProduct(null);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 4000);
    }
  };

  return (
    <div className="bg-brand-beige">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-brand-dark mb-2 font-heading">Bienvenido, {currentUser?.name}</h1>
        <p className="text-lg text-slate-600 mb-8">Aquí tienes un resumen de tu actividad financiera.</p>

          {showSuccessMessage && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-sm" role="alert">
                  <p className="font-bold font-heading">¡Solicitud Enviada!</p>
                  <p>Tu solicitud ha sido recibida. Puedes seguir su estado en la sección "Estado de mis Solicitudes".</p>
              </div>
          )}

        {/* Request New Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brand-dark mb-4 font-heading">Solicitar Nuevos Productos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RequestButton 
                  title="Abrir Cuenta de Ahorros" 
                  icon={<BuildingOffice2Icon className="h-8 w-8"/>} 
                  onClick={() => handleRequestProduct(ProductType.SavingsAccount)}
                  iconClasses="bg-brand-green-light text-brand-green"
              />
              <RequestButton 
                  title="Solicitar un Crédito" 
                  icon={<CurrencyDollarIcon className="h-8 w-8"/>} 
                  onClick={() => handleRequestProduct(ProductType.Credit)}
                  iconClasses="bg-yellow-100 text-yellow-500"
              />
              <RequestButton title="Contratar un Seguro" icon={<ShieldCheckIcon className="h-8 w-8"/>} onClick={() => handleRequestProduct(ProductType.Insurance)} />
          </div>
        </div>
        
        {/* My Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brand-dark mb-4 font-heading">Mis Productos Financieros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProducts.credits.map(c => <ProductCard key={c.id} title="Crédito Agrícola" icon={<BanknotesIcon className="h-6 w-6"/>} details={[['Monto', c.amount.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})], ['Cuota Mensual', c.monthlyPayment.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})], ['Estado', c.status]]} />)}
              {userProducts.savings.map(s => <ProductCard key={s.id} title="Cuenta de Ahorros" icon={<BuildingLibraryIcon className="h-6 w-6"/>} details={[['No. Cuenta', s.accountNumber], ['Saldo', s.balance.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})]]} />)}
              {userProducts.insurances.map(i => <ProductCard key={i.id} title={`Seguro de ${i.type}`} icon={<ShieldCheckIcon className="h-6 w-6"/>} details={[['No. Póliza', i.policyNumber], ['Cobertura', i.coverage.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})], ['Vence', i.endDate]]} />)}
              {userProducts.credits.length + userProducts.savings.length + userProducts.insurances.length === 0 && (
                  <p className="text-slate-500 col-span-full">Aún no tienes productos activos. ¡Anímate a solicitar uno!</p>
              )}
          </div>
        </div>
        
        {/* My Applications */}
        <div>
          <h2 className="text-2xl font-bold text-brand-dark mb-4 font-heading">Estado de mis Solicitudes</h2>
           <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 overflow-x-auto">
              <table className="min-w-full text-sm">
                  <thead className="bg-slate-50">
                      <tr>
                          <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Fecha</th>
                          <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Tipo de Producto</th>
                          <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Detalles</th>
                          <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Estado</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                      {userProducts.applications.length > 0 ? userProducts.applications.map(app => (
                          <tr key={app.id}>
                              <td className="py-3 px-4">{app.applicationDate}</td>
                              <td className="py-3 px-4 font-medium font-heading">{app.productType}</td>
                              <td className="py-3 px-4 text-slate-500">{formatApplicationDetails(app)}</td>
                              <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                          </tr>
                      )) : (
                          <tr><td colSpan={4} className="text-center py-6 text-slate-500">No tienes solicitudes recientes.</td></tr>
                      )}
                  </tbody>
              </table>
          </div>
        </div>

        {isModalOpen && selectedProduct && (
          <ApplicationFormModal 
              productType={selectedProduct} 
              onClose={() => setIsModalOpen(false)} 
              onSubmit={handleApplicationSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;