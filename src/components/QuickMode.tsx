import React from 'react';
import { Calculator, Users, Percent } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

interface QuickModeProps {
  totalAmount: number;
  setTotalAmount: (value: number) => void;
  numberOfPeople: number;
  setNumberOfPeople: (value: number) => void;
  tipPercentage: number;
  setTipPercentage: (value: number) => void;
  currency: string;
  finalTotal: number;
  amountPerPerson: number;
}

export const QuickMode: React.FC<QuickModeProps> = ({
  totalAmount,
  setTotalAmount,
  numberOfPeople,
  setNumberOfPeople,
  tipPercentage,
  setTipPercentage,
  currency,
  finalTotal,
  amountPerPerson
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total da Conta */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calculator className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Total da Conta</h3>
          </div>
          <input
            type="number"
            value={totalAmount || ''}
            onChange={(e) => setTotalAmount(Number(e.target.value))}
            placeholder="0.00"
            className="w-full p-3 text-2xl font-bold text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Número de Pessoas */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Pessoas</h3>
          </div>
          <input
            type="number"
            value={numberOfPeople || ''}
            onChange={(e) => setNumberOfPeople(Math.max(1, Number(e.target.value)))}
            min="1"
            placeholder="1"
            className="w-full p-3 text-2xl font-bold text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Gorjeta */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Percent className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Gorjeta (%)</h3>
          </div>
          <div className="space-y-3">
            <input
              type="number"
              value={tipPercentage || ''}
              onChange={(e) => setTipPercentage(Number(e.target.value))}
              placeholder="10"
              className="w-full p-3 text-2xl font-bold text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <div className="flex space-x-2">
              {[10, 15, 20].map((tip) => (
                <button
                  key={tip}
                  onClick={() => setTipPercentage(tip)}
                  className="flex-1 py-2 px-3 text-sm bg-gray-100 hover:bg-orange-100 text-gray-700 rounded-lg transition-colors"
                >
                  {tip}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 rounded-xl text-white shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-orange-200 text-sm uppercase tracking-wide">Total Final</p>
            <p className="text-3xl font-bold">{formatCurrency(finalTotal, currency)}</p>
          </div>
          <div className="text-center">
            <p className="text-orange-200 text-sm uppercase tracking-wide">Por Pessoa</p>
            <p className="text-3xl font-bold">{formatCurrency(amountPerPerson, currency)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};