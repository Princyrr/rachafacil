import React, { useState } from 'react';
import { History, Trash2, Calendar, MapPin } from 'lucide-react';
import { BillCalculation } from '../types';
import { formatCurrency } from '../utils/calculations';

interface HistoryPanelProps {
  calculations: BillCalculation[];
  onLoadCalculation: (calculation: BillCalculation) => void;
  onDeleteCalculation: (id: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  calculations,
  onLoadCalculation,
  onDeleteCalculation
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (calculations.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
        <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Nenhum cálculo salvo ainda</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <History className="h-6 w-6 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-800">
            Histórico ({calculations.length})
          </h3>
        </div>
        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ↓
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200">
          <div className="max-h-96 overflow-y-auto">
            {calculations.map((calc) => (
              <div key={calc.id} className="p-4 border-b border-gray-100 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1 cursor-pointer" onClick={() => onLoadCalculation(calc)}>
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <h4 className="font-semibold text-gray-800">{calc.restaurantName}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        calc.mode === 'quick' ? 'bg-blue-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {calc.mode === 'quick' ? 'Rápido' : 'Avançado'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(calc.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <span>{calc.numberOfPeople} pessoa(s)</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold text-orange-600">
                        {formatCurrency(calc.finalTotal, calc.currency)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCalculation(calc.id);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};