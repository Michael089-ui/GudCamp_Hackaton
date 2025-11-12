

import React, { useState } from 'react';
import { ProductType, CropType } from '../types';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface ApplicationFormModalProps {
  productType: ProductType;
  onClose: () => void;
  onSubmit: (details: Record<string, any>) => void;
}

const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({ productType, onClose, onSubmit }) => {
  const [details, setDetails] = useState<Record<string, any>>({});
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const isNumber = type === 'number';
    setDetails(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };
  
  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (productType === ProductType.Credit) {
        if (!details.amount || details.amount < 500000) {
            setError('El monto mínimo a solicitar es de $500,000.');
            return;
        }
        if (!details.term || details.term < 6) {
            setError('El plazo mínimo del crédito es de 6 meses.');
            return;
        }
        if (!details.cropType) {
            setError('Por favor, seleccione un tipo de cultivo.');
            return;
        }
        if (details.cropType === CropType.Otro && (!details.customCropName || details.customCropName.trim() === '')) {
            setError('Por favor, especifique el nombre del cultivo.');
            return;
        }
        if (!details.purpose || details.purpose.trim().length < 10) {
            setError('Por favor, describa brevemente el propósito del crédito (mínimo 10 caracteres).');
            return;
        }
    }
     if (productType === ProductType.SavingsAccount && (!details.initialDeposit || details.initialDeposit < 0)) {
        setError('Por favor, ingrese un depósito inicial válido.');
        return;
    }
     if (productType === ProductType.Insurance && (!details.insuranceType || !details.coverage || details.coverage <= 0)) {
        setError('Por favor, seleccione un tipo de seguro e ingrese una cobertura válida.');
        return;
    }

    onSubmit(details);
  };

  const renderFormFields = () => {
    switch (productType) {
      case ProductType.Credit:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="amount" className="block text-gray-700 font-bold mb-2 font-heading">Monto a Solicitar</label>
                <input type="number" id="amount" name="amount" onChange={handleInputChange} className="w-full p-3 border rounded-xl" placeholder="5000000" min="500000" step="100000" required />
              </div>
              <div>
                <label htmlFor="term" className="block text-gray-700 font-bold mb-2 font-heading">Plazo (en meses)</label>
                <input type="number" id="term" name="term" onChange={handleInputChange} className="w-full p-3 border rounded-xl" placeholder="24" min="6" step="1" required />
              </div>
            </div>
             <div className="mb-4">
                <label htmlFor="cropType" className="block text-gray-700 font-bold mb-2 font-heading">Tipo de Cultivo</label>
                <select id="cropType" name="cropType" onChange={handleInputChange} className="w-full p-3 border rounded-xl bg-white" required>
                    <option value="">Seleccione uno...</option>
                    {Object.values(CropType).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            {details.cropType === CropType.Otro && (
                 <div className="mb-4 animate-fadeIn">
                    <label htmlFor="customCropName" className="block text-gray-700 font-bold mb-2 font-heading">Especifique el Cultivo</label>
                    <input type="text" id="customCropName" name="customCropName" onChange={handleInputChange} className="w-full p-3 border rounded-xl" placeholder="Ej: Lulo, Maracuyá..." required />
                </div>
            )}
            <div className="mb-4">
              <label htmlFor="purpose" className="block text-gray-700 font-bold mb-2 font-heading">Propósito del Crédito</label>
              <textarea id="purpose" name="purpose" onChange={handleInputChange} rows={3} className="w-full p-3 border rounded-xl" placeholder="Ej: Compra de insumos, mantenimiento de maquinaria, etc." required></textarea>
            </div>
          </>
        );
      case ProductType.SavingsAccount:
        return (
          <div className="mb-4">
            <label htmlFor="initialDeposit" className="block text-gray-700 font-bold mb-2 font-heading">Depósito Inicial</label>
            <input type="number" id="initialDeposit" name="initialDeposit" onChange={handleInputChange} className="w-full p-3 border rounded-xl" placeholder="100000" required />
          </div>
        );
      case ProductType.Insurance:
        return (
          <>
            <div className="mb-4">
                <label htmlFor="insuranceType" className="block text-gray-700 font-bold mb-2 font-heading">Tipo de Seguro</label>
                <select id="insuranceType" name="insuranceType" onChange={handleInputChange} className="w-full p-3 border rounded-xl bg-white" required>
                    <option value="">Seleccione uno...</option>
                    <option value="Vida">Seguro de Vida</option>
                    <option value="Cultivo">Seguro de Cultivo</option>
                    <option value="Maquinaria">Seguro de Maquinaria</option>
                </select>
            </div>
            <div className="mb-4">
              <label htmlFor="coverage" className="block text-gray-700 font-bold mb-2 font-heading">Monto de Cobertura</label>
              <input type="number" id="coverage" name="coverage" onChange={handleInputChange} className="w-full p-3 border rounded-xl" placeholder="20000000" required />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg animate-scaleIn relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Cerrar modal">
            <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 id="modal-title" className="text-2xl font-bold mb-6 text-slate-800 font-heading">Solicitud de {productType}</h2>
        <form onSubmit={validateAndSubmit}>
          {renderFormFields()}
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <div className="flex justify-end space-x-4 mt-8">
            <button type="button" onClick={onClose} className="bg-slate-100 text-brand-dark font-semibold py-2 px-6 rounded-xl hover:bg-slate-200 transition-colors duration-300 shadow-sm hover:shadow-md">Cancelar</button>
            <button type="submit" className="bg-gradient-to-r from-brand-green to-brand-gold hover:from-brand-green-dark hover:to-brand-gold-dark text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 ease-in-out shadow-md hover:shadow-lg [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] font-heading">Enviar Solicitud</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationFormModal;