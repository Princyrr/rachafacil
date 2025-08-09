import React from 'react';
import { Plus, Minus, User, ArrowRightLeft } from 'lucide-react';
import { Person } from '../types';
import { formatCurrency } from '../utils/calculations';

interface AdvancedModeProps {
  people: Person[];
  setPeople: (people: Person[]) => void;
  serviceRate: number;
  setServiceRate: (value: number) => void;
  discount: number;
  setDiscount: (value: number) => void;
  isDiscountPercentage: boolean;
  setIsDiscountPercentage: (value: boolean) => void;
  currency: string;
  onTransferAmount: (fromId: string, toId: string, amount: number) => void;
}

export const AdvancedMode: React.FC<AdvancedModeProps> = ({
  people,
  setPeople,
  serviceRate,
  setServiceRate,
  discount,
  setDiscount,
  isDiscountPercentage,
  setIsDiscountPercentage,
  currency,
  onTransferAmount
}) => {
  const addPerson = () => {
    const newPerson: Person = {
      id: Date.now().toString(),
      name: `Pessoa ${people.length + 1}`,
      amount: 0,
      finalAmount: 0
    };
    setPeople([...people, newPerson]);
  };

  const removePerson = (id: string) => {
    if (people.length > 1) {
      setPeople(people.filter(person => person.id !== id));
    }
  };

  const updatePerson = (id: string, field: keyof Person, value: string | number) => {
    setPeople(people.map(person => 
      person.id === id ? { ...person, [field]: value } : person
    ));
  };

  const handleTransfer = (fromId: string, toId: string, amount: number) => {
    if (amount > 0 && fromId !== toId) {
      onTransferAmount(fromId, toId, amount);
    }
  };

  return (
    <div className="space-y-8">
      {/* Configurações Avançadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Taxa de Serviço */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Taxa de Serviço (%)</h3>
          <input
            type="number"
            value={serviceRate || ''}
            onChange={(e) => setServiceRate(Number(e.target.value))}
            placeholder="0"
            className="w-full p-3 text-xl font-semibold text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Desconto */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Desconto</h3>
          <div className="space-y-3">
            <input
              type="number"
              value={discount || ''}
              onChange={(e) => setDiscount(Number(e.target.value))}
              placeholder="0"
              className="w-full p-3 text-xl font-semibold text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setIsDiscountPercentage(true)}
                className={`flex-1 py-2 px-4 text-sm rounded-lg transition-colors ${
                  isDiscountPercentage 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                }`}
              >
                Porcentagem
              </button>
              <button
                onClick={() => setIsDiscountPercentage(false)}
                className={`flex-1 py-2 px-4 text-sm rounded-lg transition-colors ${
                  !isDiscountPercentage 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                }`}
              >
                Valor Fixo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pessoas e Consumo Individual */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Consumo Individual</h3>
          <button
            onClick={addPerson}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Pessoa</span>
          </button>
        </div>

        <div className="space-y-4">
          {people.map((person, index) => (
            <div key={person.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-gray-50 rounded-lg">
              <div className="md:col-span-1 flex items-center justify-center">
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              
              <div className="md:col-span-4">
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome"
                />
              </div>

              <div className="md:col-span-3">
                <input
                  type="number"
                  value={person.amount || ''}
                  onChange={(e) => updatePerson(person.id, 'amount', Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Consumo"
                />
              </div>

              <div className="md:col-span-3 text-center">
                <span className="text-lg font-semibold text-gray-800">
                  {formatCurrency(person.finalAmount, currency)}
                </span>
              </div>

              <div className="md:col-span-1">
                {people.length > 1 && (
                  <button
                    onClick={() => removePerson(person.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transferências */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <ArrowRightLeft className="h-5 w-5 text-blue-600" />
          <span>Transferir Pagamento</span>
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Permite que uma pessoa cubra parte da conta de outra.
        </p>
        
        <TransferSection people={people} onTransfer={handleTransfer} currency={currency} />
      </div>
    </div>
  );
};

const TransferSection: React.FC<{
  people: Person[];
  onTransfer: (fromId: string, toId: string, amount: number) => void;
  currency: string;
}> = ({ people, onTransfer, currency }) => {
  const [fromId, setFromId] = React.useState('');
  const [toId, setToId] = React.useState('');
  const [amount, setAmount] = React.useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromId && toId && amount > 0) {
      onTransfer(fromId, toId, amount);
      setAmount(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <select
        value={fromId}
        onChange={(e) => setFromId(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      >
        <option value="">De quem</option>
        {people.map(person => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </select>

      <select
        value={toId}
        onChange={(e) => setToId(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        required
      >
        <option value="">Para quem</option>
        {people.map(person => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={amount || ''}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Valor"
        min="0.01"
        step="0.01"
        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />

      <button
        type="submit"
        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
      >
        Transferir
      </button>
    </form>
  );
};