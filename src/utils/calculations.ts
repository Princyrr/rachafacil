import { Person, BillCalculation } from '../types';

export const formatCurrency = (amount: number, currency: string): string => {
  const symbols: { [key: string]: string } = {
    BRL: 'R$',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥'
  };
  
  return `${symbols[currency] || currency} ${amount.toFixed(2)}`;
};

export const calculateTotalWithTaxes = (
  baseAmount: number,
  tipPercentage: number,
  serviceRate: number
): number => {
  const tip = baseAmount * (tipPercentage / 100);
  const service = baseAmount * (serviceRate / 100);
  return baseAmount + tip + service;
};

export const applyDiscount = (
  amount: number,
  discount: number,
  isPercentage: boolean
): number => {
  if (isPercentage) {
    return amount - (amount * (discount / 100));
  }
  return Math.max(0, amount - discount);
};

export const roundAmount = (amount: number, type: 'up' | 'down' | 'nearest'): number => {
  switch (type) {
    case 'up':
      return Math.ceil(amount);
    case 'down':
      return Math.floor(amount);
    case 'nearest':
      return Math.round(amount);
    default:
      return amount;
  }
};

export const calculatePersonalizedSplit = (
  people: Person[],
  totalWithTaxes: number,
  totalOriginal: number
): Person[] => {
  const totalPersonalAmount = people.reduce((sum, person) => sum + person.amount, 0);
  
  return people.map(person => ({
    ...person,
    finalAmount: totalPersonalAmount > 0 
      ? (person.amount / totalPersonalAmount) * totalWithTaxes
      : totalWithTaxes / people.length
  }));
};

export const transferAmount = (
  people: Person[],
  fromId: string,
  toId: string,
  amount: number
): Person[] => {
  return people.map(person => {
    if (person.id === fromId) {
      return { ...person, finalAmount: person.finalAmount - amount };
    }
    if (person.id === toId) {
      return { ...person, finalAmount: person.finalAmount + amount };
    }
    return person;
  });
};