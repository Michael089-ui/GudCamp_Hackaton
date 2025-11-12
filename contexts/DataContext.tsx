

import React, { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { User, CreditSimulation, CropType, CreditStatus, PlanType, SavingsAccount, Insurance, Application, ApplicationStatus, ProductType } from '../types';

interface DataContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  credits: CreditSimulation[];
  setCredits: React.Dispatch<React.SetStateAction<CreditSimulation[]>>;
  savingsAccounts: SavingsAccount[];
  setSavingsAccounts: React.Dispatch<React.SetStateAction<SavingsAccount[]>>;
  insurances: Insurance[];
  setInsurances: React.Dispatch<React.SetStateAction<Insurance[]>>;
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialUsers: User[] = [
  { id: 'user-1', name: 'Juan Valdez', email: 'juan.v@finca.co', password: 'password123', location: 'Antioquia', registeredDate: '2023-01-15' },
  { id: 'user-2', name: 'Maria Garcia', email: 'maria.g@campo.co', password: 'password123', location: 'Cundinamarca', registeredDate: '2023-02-20' },
  { id: 'user-3', name: 'Pedro Páramo', email: 'pedro.p@tierra.co', password: 'password123', location: 'Boyacá', registeredDate: '2023-03-10' },
];

const initialCredits: CreditSimulation[] = [
  { id: 'credit-1', userId: 'user-1', amount: 5000000, cropType: CropType.Cafe, interestRate: 1.5, term: 24, monthlyPayment: 249624, totalInterest: 990976, status: CreditStatus.Active, simulationDate: '2023-04-01', plan: PlanType.Cosecha },
  { id: 'credit-2', userId: 'user-2', amount: 3000000, cropType: CropType.Platano, interestRate: 1.8, term: 18, monthlyPayment: 197341, totalInterest: 552138, status: CreditStatus.Active, simulationDate: '2023-04-05', plan: PlanType.Semilla },
  { id: 'credit-3', amount: 7000000, cropType: CropType.Yuca, interestRate: 1.6, term: 36, monthlyPayment: 246533, totalInterest: 1875188, status: CreditStatus.Simulated, simulationDate: '2023-04-10', plan: PlanType.Raiz },
  { id: 'credit-4', userId: 'user-1', amount: 1200000, cropType: CropType.Cafe, interestRate: 1.9, term: 12, monthlyPayment: 112825, totalInterest: 153900, status: CreditStatus.Simulated, simulationDate: '2023-05-02', plan: PlanType.Semilla },
];

const initialSavingsAccounts: SavingsAccount[] = [
    { id: 'sa-1', userId: 'user-1', accountNumber: '0123456789', balance: 1250000, openedDate: '2022-11-20' },
];

const initialInsurances: Insurance[] = [
    { id: 'ins-1', userId: 'user-2', policyNumber: 'POL-98765', type: 'Cultivo', coverage: 20000000, premium: 800000, startDate: '2023-01-01', endDate: '2023-12-31' },
];

const initialApplications: Application[] = [
    { id: 'app-1', userId: 'user-1', productType: ProductType.Insurance, status: ApplicationStatus.Pending, details: { type: 'Maquinaria', coverage: 15000000 }, applicationDate: '2023-06-01' },
    { id: 'app-2', userId: 'user-2', productType: ProductType.Credit, status: ApplicationStatus.Rejected, details: { amount: 10000000, term: 48, cropType: 'Cacao' }, applicationDate: '2023-05-28', decisionDate: '2023-05-30' },
];


export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useLocalStorage<User[]>('users', []);
  const [credits, setCredits] = useLocalStorage<CreditSimulation[]>('credits', []);
  const [savingsAccounts, setSavingsAccounts] = useLocalStorage<SavingsAccount[]>('savingsAccounts', []);
  const [insurances, setInsurances] = useLocalStorage<Insurance[]>('insurances', []);
  const [applications, setApplications] = useLocalStorage<Application[]>('applications', []);

  useEffect(() => {
    // Seed data if localStorage is empty
    if (localStorage.getItem('users') === null) setUsers(initialUsers);
    if (localStorage.getItem('credits') === null) setCredits(initialCredits);
    if (localStorage.getItem('savingsAccounts') === null) setSavingsAccounts(initialSavingsAccounts);
    if (localStorage.getItem('insurances') === null) setInsurances(initialInsurances);
    if (localStorage.getItem('applications') === null) setApplications(initialApplications);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DataContext.Provider value={{ users, setUsers, credits, setCredits, savingsAccounts, setSavingsAccounts, insurances, setInsurances, applications, setApplications }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};