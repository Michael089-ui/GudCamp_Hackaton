import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CropType, CreditSimulation, CreditStatus, AmortizationEntry, PlanType } from '../types';
import { useData } from '../contexts/DataContext';
import AmortizationChart from '../components/AmortizationChart';
import SimulationResults from '../components/SimulationResults';
import DownloadPdfModal from '../components/DownloadPdfModal'; // Importar el nuevo modal

const BASE_INTEREST_RATES: Record<string, number> = {
  [CropType.Cafe]: 1.5,
  [CropType.Maiz]: 1.3,
  [CropType.Platano]: 1.4,
  [CropType.Yuca]: 1.6,
  [CropType.Cacao]: 1.7,
  [CropType.Otro]: 2.2, // Tasa base más alta para riesgo desconocido, se ajusta a la baja
};

const SliderInput: React.FC<{
    label: string;
    id: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
    format: (value: number) => string;
    error?: string;
}> = ({ label, id, value, onChange, min, max, step, format, error }) => (
    <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2 font-heading" htmlFor={id}>
            {label} - <span className="bg-gradient-to-r from-brand-green to-brand-gold bg-clip-text text-transparent font-extrabold">{format(value)}</span>
        </label>
        <input
            type="range"
            id={`${id}-slider`}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{format(min)}</span>
            <span>{format(max)}</span>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);


type FormErrors = {
    amount?: string;
    interestRate?: string;
    term?: string;
    customCropName?: string;
    hectares?: string;
    arrobas?: string;
};

const CalculatorPage: React.FC = () => {
  const { credits, setCredits } = useData();
  const [searchParams] = useSearchParams();

  // --- STATE ---
  const [amount, setAmount] = useState<number>(5000000);
  const [cropType, setCropType] = useState<CropType>(CropType.Cafe);
  const [customCropName, setCustomCropName] = useState<string>('');
  const [interestRate, setInterestRate] = useState<number>(1.5);
  const [term, setTerm] = useState<number>(24);
  const [plan, setPlan] = useState<PlanType | undefined>();
  const [hectares, setHectares] = useState<number>(5);
  const [arrobas, setArrobas] = useState<number>(20);

  const [result, setResult] = useState<CreditSimulation | null>(null);
  const [amortization, setAmortization] = useState<AmortizationEntry[]>([]);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el nuevo modal

  // --- EFFECTS ---
  useEffect(() => {
    const baseRate = BASE_INTEREST_RATES[cropType] || 2.2;
    const hectareDiscount = Math.min(hectares * 0.015, 0.25);
    const salesBonus = Math.min(arrobas * 0.002, 0.15);
    let finalRate = baseRate - hectareDiscount - salesBonus;
    finalRate = Math.max(0.8, finalRate); // Floor rate
    
    setInterestRate(parseFloat(finalRate.toFixed(2)));
  }, [cropType, hectares, arrobas]);

  const performCalculation = (
    calcAmount: number, 
    calcInterest: number, 
    calcTerm: number, 
    calcCrop: CropType, 
    calcPlan?: PlanType,
    calcCustomCropName?: string
  ) => {
    const principal = calcAmount;
    const monthlyRate = calcInterest / 100;
    const numberOfPayments = calcTerm;

    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      setResult(null);
      setAmortization([]);
      return;
    }

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    const newSimulation: CreditSimulation = {
      id: `sim-${Date.now()}`,
      amount: principal,
      cropType: calcCrop,
      customCropName: calcCrop === CropType.Otro ? calcCustomCropName : undefined,
      interestRate: calcInterest,
      term: numberOfPayments,
      monthlyPayment: monthlyPayment,
      totalInterest: totalInterest,
      status: CreditStatus.Simulated,
      simulationDate: new Date().toISOString().split('T')[0],
      plan: calcPlan,
    };
    setResult(newSimulation);

    let balance = principal;
    const newAmortization: AmortizationEntry[] = [];
    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      newAmortization.push({
        month: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance > 0 ? balance : 0,
      });
    }
    setAmortization(newAmortization);
  };

  useEffect(() => {
    const urlAmount = searchParams.get('amount');
    const urlInterestRate = searchParams.get('interestRate');
    const urlTerm = searchParams.get('term');
    const urlPlan = searchParams.get('plan') as PlanType;

    let prefillAmount = amount;
    let prefillInterest = interestRate;
    let prefillTerm = term;

    let shouldCalculate = false;
    if (urlAmount) { prefillAmount = Number(urlAmount); setAmount(prefillAmount); shouldCalculate = true; }
    if (urlInterestRate) { prefillInterest = Number(urlInterestRate); setInterestRate(prefillInterest); shouldCalculate = true; }
    if (urlTerm) { prefillTerm = Number(urlTerm); setTerm(prefillTerm); shouldCalculate = true; }
    if (urlPlan && Object.values(PlanType).includes(urlPlan)) { setPlan(urlPlan); }

    if (shouldCalculate) {
      setIsDirty(true);
      performCalculation(prefillAmount, prefillInterest, prefillTerm, cropType, urlPlan, customCropName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  
  const updateForm = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (value: T) => {
    setter(value);
    if (!isDirty) setIsDirty(true);
    if (result) setResult(null);
    if (amortization.length > 0) setAmortization([]);
  };

  const validateForm = (): boolean => {
      const newErrors: FormErrors = {};
      if (amount < 500000) newErrors.amount = 'El monto mínimo es $500,000 COP.';
      if (interestRate <= 0 || interestRate > 50) newErrors.interestRate = 'La tasa debe ser un valor positivo y razonable.';
      if (term < 6 || !Number.isInteger(term)) newErrors.term = 'El plazo debe ser de al menos 6 meses.';
      if (hectares <= 0) newErrors.hectares = 'El número de hectáreas debe ser positivo.';
      if (arrobas < 0) newErrors.arrobas = 'El número de arrobas no puede ser negativo.';

      if (cropType === CropType.Otro) {
        if (!customCropName.trim()) {
            newErrors.customCropName = 'Debe especificar el nombre del cultivo.';
        } else if (!/^[a-zA-Z\s]+$/.test(customCropName)) {
            newErrors.customCropName = 'El nombre solo debe contener letras y espacios.';
        }
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };
  
  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSavedMessage(false);
    if (validateForm()) {
        performCalculation(amount, interestRate, term, cropType, plan, customCropName);
    } else {
        setResult(null);
        setAmortization([]);
    }
  };

  const handleGuardarSimulacion = () => {
    if (result) {
      setCredits([...credits, result]);
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 3000);
      // Abrir el modal después de guardar
      setIsModalOpen(true);
    }
  };

  const handleReset = () => {
    setAmount(5000000);
    setCropType(CropType.Cafe);
    setCustomCropName('');
    setTerm(24);
    setHectares(5);
    setArrobas(20);
    setResult(null);
    setAmortization([]);
    setShowSavedMessage(false);
    setErrors({});
    setPlan(undefined);
    setIsDirty(false);
  };
  
  return (
    <div className="calculadora-container container mx-auto px-6 py-12 relative overflow-hidden rounded-2xl border border-slate-200">
        <div className="text-center mb-12 bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-sm">
            <h1 className="text-4xl font-bold text-brand-dark animate-fadeIn font-heading">Calculadora Financiera Inteligente</h1>
            <p 
                className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto animate-fadeIn"
                style={{ animationDelay: '0.2s' }}
            >
                Usa esta herramienta para proyectar tu crédito agrícola. Es el primer paso para planificar tu próxima siembra y cosecha con confianza.
            </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg animate-fadeIn">
                <form onSubmit={handleSimulate}>
                    <SliderInput
                        label="Monto del Crédito"
                        id="amount"
                        value={amount}
                        onChange={updateForm(setAmount)}
                        min={500000}
                        max={50000000}
                        step={100000}
                        format={(v) => v.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                        error={errors.amount}
                    />
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2 font-heading" htmlFor="cropType">Tipo de Cultivo</label>
                        <select id="cropType" value={cropType} onChange={e => updateForm(setCropType)(e.target.value as CropType)} className="w-full p-3 border rounded-xl border-gray-300 bg-white">
                            {Object.values(CropType).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {cropType === CropType.Otro && (
                        <div className="mb-4 animate-fadeIn">
                            <label className="block text-gray-700 font-bold mb-2 font-heading" htmlFor="customCropName">Nombre del Cultivo</label>
                            <input type="text" id="customCropName" value={customCropName} onChange={e => updateForm(setCustomCropName)(e.target.value)} className={`w-full p-3 border rounded-xl ${errors.customCropName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ej: Lulo, Maracuyá..."/>
                            {errors.customCropName && <p className="text-red-500 text-sm mt-1">{errors.customCropName}</p>}
                            <p className="text-xs text-gray-500 mt-1">Se aplicará una tasa base de {BASE_INTEREST_RATES[CropType.Otro]}%, ajustada según tus datos de producción.</p>
                        </div>
                    )}
                    
                    <SliderInput
                        label="Hectáreas Sembradas"
                        id="hectares"
                        value={hectares}
                        onChange={updateForm(setHectares)}
                        min={1}
                        max={100}
                        step={1}
                        format={(v) => `${v} ha`}
                        error={errors.hectares}
                    />
                     <p className="text-xs text-gray-500 -mt-4 mb-4 ml-1">1 hectárea equivale a 10.000 m².</p>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2 font-heading" htmlFor="arrobas">Arrobas Vendidas (Promedio Mensual)</label>
                        <input type="number" id="arrobas" value={arrobas} onChange={e => updateForm(setArrobas)(Number(e.target.value))} className={`w-full p-3 border rounded-xl ${errors.arrobas ? 'border-red-500' : 'border-gray-300'}`} min="0" step="1" />
                        {errors.arrobas && <p className="text-red-500 text-sm mt-1">{errors.arrobas}</p>}
                        <p className="text-xs text-gray-500 mt-1 ml-1">1 arroba equivale a 12.5 kg.</p>
                    </div>

                    <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <label className="block text-gray-700 font-bold mb-2 font-heading" htmlFor="interestRate">Tasa de Interés Mensual Sugerida (%)</label>
                        <input type="number" id="interestRate" value={interestRate} onChange={e => updateForm(setInterestRate)(Number(e.target.value))} className={`w-full p-3 border rounded-xl ${errors.interestRate ? 'border-red-500' : 'border-gray-300'}`} min="0.1" step="0.01" />
                        {errors.interestRate && <p className="text-red-500 text-sm mt-1">{errors.interestRate}</p>}
                         <p className="text-xs text-gray-500 mt-1">Tasa ajustada automáticamente. Puedes modificarla si necesitas.</p>
                    </div>

                    <SliderInput
                        label="Plazo"
                        id="term"
                        value={term}
                        onChange={updateForm(setTerm)}
                        min={6}
                        max={60}
                        step={6}
                        format={(v) => `${v} Meses`}
                        error={errors.term}
                    />

                    <button type="submit" className="w-full bg-gradient-to-r from-brand-green to-brand-gold hover:from-brand-green-dark hover:to-brand-gold-dark text-white font-bold py-3 rounded-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] font-heading">
                        Calcular
                    </button>
                </form>
            </div>

            <SimulationResults
                isDirty={isDirty}
                result={result}
                simulationInput={{
                    amount,
                    interestRate,
                    term,
                    cropType,
                    customCropName,
                    hectares,
                    arrobas,
                }}
                showSavedMessage={showSavedMessage}
                onSave={handleGuardarSimulacion}
                onReset={handleReset}
            />

        </div>
        {amortization.length > 0 && result && (
            <div className="grid grid-cols-1">
                <AmortizationChart 
                    result={result} 
                    data={amortization}
                    hectares={hectares}
                    arrobas={arrobas}
                />
            </div>
        )}
        
        {/* Renderizar el modal */}
        <DownloadPdfModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
    </div>
  );
};

export default CalculatorPage;