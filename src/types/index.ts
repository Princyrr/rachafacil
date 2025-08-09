export interface Person {
  id: string;
  name: string;
  amount: number;
  finalAmount: number;
}

export interface BillCalculation {
  id: string;
  restaurantName: string;
  date: string;
  totalAmount: number;
  numberOfPeople: number;
  tipPercentage: number;
  serviceRate: number;
  discount: number;
  isDiscountPercentage: boolean;
  currency: string;
  people: Person[];
  mode: 'quick' | 'advanced';
  finalTotal: number;
}

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

export interface RoundingOption {
  type: 'up' | 'down' | 'nearest';
  label: string;
}