import React from 'react';
import { RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';
import { Person } from '../types';
import { roundAmount } from '../utils/calculations';

interface RoundingControlsProps {
  people: Person[];
  setPeople: (people: Person[]) => void;
}

export const RoundingControls: React.FC<RoundingControlsProps> = ({
  people,
  setPeople
}) => {
  const applyRounding = (type: 'up' | 'down' | 'nearest') => {
    const roundedPeople = people.map(person => ({
      ...person,
      finalAmount: roundAmount(person.finalAmount, type)
    }));
    setPeople(roundedPeople);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
        <RotateCcw className="h-5 w-5 text-orange-600" />
        <span>Arredondamento</span>
      </h3>
      
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => applyRounding('up')}
          className="flex flex-col items-center space-y-2 p-4 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors"
        >
          <ArrowUp className="h-5 w-5" />
          <span className="text-sm font-medium">Para Cima</span>
        </button>

        <button
          onClick={() => applyRounding('nearest')}
          className="flex flex-col items-center space-y-2 p-4 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors"
        >
          <RotateCcw className="h-5 w-5" />
          <span className="text-sm font-medium">Mais Próximo</span>
        </button>

        <button
          onClick={() => applyRounding('down')}
          className="flex flex-col items-center space-y-2 p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
        >
          <ArrowDown className="h-5 w-5" />
          <span className="text-sm font-medium">Para Baixo</span>
        </button>
      </div>
    </div>
  );
};