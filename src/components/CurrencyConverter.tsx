import React from 'react';
import { DollarSign } from 'lucide-react';
import { currencies, convertCurrency } from '../data/currencies';

interface CurrencyConverterProps {
  currency: string;
  setCurrency: (currency: string) => void;
  amount: number;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  currency,
  setCurrency,
  amount
}) => {
  const currentRate = currencies.find(c => c.code === currency)?.rate || 1;
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <DollarSign className="h-5 w-5 text-green-600" />
        </div>
        <h3 className="font-semibold text-gray-800">Moeda</h3>
      </div>
      
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        {currencies.map(curr => (
          <option key={curr.code} value={curr.code}>
            {curr.symbol} {curr.name} ({curr.code})
          </option>
        ))}
      </select>

      {amount > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Conversões equivalentes:</p>
          <div className="space-y-1">
            {currencies
              .filter(c => c.code !== currency)
              .map(curr => {
                const convertedAmount = convertCurrency(amount, currentRate, curr.rate);
                return (
                  <div key={curr.code} className="flex justify-between text-sm">
                    <span>{curr.code}</span>
                    <span>{curr.symbol} {convertedAmount.toFixed(2)}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};