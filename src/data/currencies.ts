import { CurrencyRate } from '../types';

export const currencies: CurrencyRate[] = [
  { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$', rate: 1 },
  { code: 'USD', name: 'Dólar Americano', symbol: '$', rate: 0.20 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.18 },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£', rate: 0.15 },
  { code: 'JPY', name: 'Iene Japonês', symbol: '¥', rate: 28.50 }
];

export const convertCurrency = (amount: number, fromRate: number, toRate: number): number => {
  return (amount / fromRate) * toRate;
};