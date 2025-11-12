


// FIX: Add missing import for React to resolve 'Cannot find namespace React' error.
import React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  location: string;
  registeredDate: string;
}

export enum CropType {
  Cafe = 'Café',
  Platano = 'Plátano',
  Yuca = 'Yuca',
  Maiz = 'Maíz',
  Cacao = 'Cacao',
  Otro = 'Otro',
}

export enum CreditStatus {
  Simulated = 'Simulated',
  Active = 'Active',
  Paid = 'Paid',
}

export enum PlanType {
  Semilla = 'Semilla',
  Cosecha = 'Cosecha',
  Raiz = 'Raíz',
}

export interface CreditSimulation {
  id: string;
  userId?: string; // Optional link to a user
  amount: number;
  cropType: CropType;
  customCropName?: string;
  interestRate: number;
  term: number; // in months
  monthlyPayment: number;
  totalInterest: number;
  status: CreditStatus;
  simulationDate: string;
  plan?: PlanType;
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

// --- NEW TYPES ---

export interface SavingsAccount {
  id: string;
  userId: string;
  accountNumber: string;
  balance: number;
  openedDate: string;
}

export interface Insurance {
  id: string;
  userId: string;
  policyNumber: string;
  type: 'Vida' | 'Cultivo' | 'Maquinaria';
  coverage: number;
  premium: number;
  startDate: string;
  endDate: string;
}

export enum ApplicationStatus {
    Pending = 'Pendiente',
    Approved = 'Aprobado',
    Rejected = 'Rechazado',
}

export enum ProductType {
    Credit = 'Crédito',
    SavingsAccount = 'Cuenta de Ahorros',
    Insurance = 'Seguro',
}

export interface Application {
    id: string;
    userId: string;
    productType: ProductType;
    status: ApplicationStatus;
    details: Record<string, any>; // e.g., { amount: 5000000, term: 24 } for a credit
    applicationDate: string;
    decisionDate?: string;
}

// --- CHATBOT TYPES ---

export interface ChatOption {
    text: string;
    action: string; // Corresponds to a key in the chat flow
    payload?: any;
    isExternalLink?: boolean;
    isAction?: boolean; // For things like call or whatsapp
}

export interface ChatMessage {
    id: number;
    text: React.ReactNode;
    sender: 'bot' | 'user';
    options?: ChatOption[];
}