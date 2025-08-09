import React from 'react';
import { Receipt, Users, Percent, Minus } from 'lucide-react';
import { Person } from '../types';
import { formatCurrency } from '../utils/calculations';

interface BillSummaryProps {
  totalAmount: number;
  tipPercentage: number;
  serviceRate: number;
  discount: number;
  isDiscountPercentage: boolean;
  finalTotal: number;
  people: Person[];
  currency: string;
}

export const BillSummary: React.FC<BillSummaryProps> = ({
  totalAmount,
  tipPercentage,
  serviceRate,
  discount,
  isDiscountPercentage,
  finalTotal,
  people,
  currency
}) => {
  const tipAmount = totalAmount * (tipPercentage / 100);
  const serviceAmount = totalAmount * (serviceRate / 100);
  const discountAmount = isDiscountPercentage 
    ? totalAmount * (discount / 100)
    : discount;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6">
        <div className="flex items-center space-x-3">
          <Receipt className="h-6 w-6 text-white" />
          <h3 className="text-xl font-bold text-white">Resumo da Conta</h3>
        </div>
        
      </div>

      <div className="p-6 space-y-6">
        {/* Detalhamento */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Valor Original</span>
            <span className="font-semibold text-gray-800">
              {formatCurrency(totalAmount, currency)}
            </span>
          </div>

          {tipAmount > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Percent className="h-4 w-4 text-orange-600" />
                <span className="text-gray-600">Gorjeta ({tipPercentage}%)</span>
              </div>
              <span className="font-semibold text-orange-600">
                + {formatCurrency(tipAmount, currency)}
              </span>
            </div>
          )}

          {serviceAmount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taxa de Serviço ({serviceRate}%)</span>
              <span className="font-semibold text-blue-600">
                + {formatCurrency(serviceAmount, currency)}
              </span>
            </div>
          )}

          {discountAmount > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Minus className="h-4 w-4 text-green-600" />
                <span className="text-gray-600">
                  Desconto {isDiscountPercentage ? `(${discount}%)` : ''}
                </span>
              </div>
              <span className="font-semibold text-green-600">
                - {formatCurrency(discountAmount, currency)}
              </span>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Total Final</span>
              <span className="text-2xl font-bold text-orange-600">
                {formatCurrency(finalTotal, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Divisão por Pessoa */}
        <div className="border-t pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-gray-600" />
            <h4 className="font-semibold text-gray-800">Pagamento por Pessoa</h4>
          </div>
          
          <div className="space-y-3">
            {people.map((person) => (
              <div key={person.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{person.name}</span>
                <span className="font-bold text-orange-600">
                  {formatCurrency(person.finalAmount, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};