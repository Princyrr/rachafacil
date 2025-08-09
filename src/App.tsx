import React, { useState, useEffect } from 'react';
import {  Zap, Settings, Save, Calculator } from 'lucide-react';
import { Person, BillCalculation } from './types';
import { QuickMode } from './components/QuickMode';
import { AdvancedMode } from './components/AdvancedMode';
import { BillSummary } from './components/BillSummary';
import { CurrencyConverter } from './components/CurrencyConverter';
import { RoundingControls } from './components/RoundingControls';
import logo from './assets/logo.png';
import { HistoryPanel } from './components/HistoryPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { 
  calculateTotalWithTaxes, 
  applyDiscount, 
  calculatePersonalizedSplit,
  transferAmount 
} from './utils/calculations';

function App() {
  // Estados principais
  const [mode, setMode] = useState<'quick' | 'advanced'>('quick');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [tipPercentage, setTipPercentage] = useState<number>(10);
  const [serviceRate, setServiceRate] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [isDiscountPercentage, setIsDiscountPercentage] = useState<boolean>(true);
  const [currency, setCurrency] = useState<string>('BRL');
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [people, setPeople] = useState<Person[]>([]);

  // Histórico
  const [calculations, setCalculations] = useLocalStorage<BillCalculation[]>('bill-calculations', []);

  // Inicializar pessoas quando o número de pessoas mudar
  useEffect(() => {
    if (mode === 'quick') {
      const newPeople: Person[] = Array.from({ length: numberOfPeople }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Pessoa ${i + 1}`,
        amount: 0,
        finalAmount: 0
      }));
      setPeople(newPeople);
    }
  }, [numberOfPeople, mode]);

  // Cálculos principais
  const totalWithTaxes = calculateTotalWithTaxes(totalAmount, tipPercentage, serviceRate);
  const totalAfterDiscount = applyDiscount(totalWithTaxes, discount, isDiscountPercentage);
  const finalTotal = Math.max(0, totalAfterDiscount);

  // Atualizar valores finais das pessoas
  useEffect(() => {
    if (mode === 'quick') {
      const amountPerPerson = finalTotal / numberOfPeople;
      setPeople(prev => prev.map(person => ({
        ...person,
        finalAmount: amountPerPerson
      })));
    } else {
      const updatedPeople = calculatePersonalizedSplit(people, finalTotal, totalAmount);
      setPeople(updatedPeople);
    }
  }, [finalTotal, mode, numberOfPeople, totalAmount]);

  // Funções de controle
  const handleModeSwitch = (newMode: 'quick' | 'advanced') => {
    setMode(newMode);
    if (newMode === 'advanced' && people.length === 0) {
      setPeople([{
        id: '1',
        name: 'Pessoa 1',
        amount: 0,
        finalAmount: 0
      }]);
    }
  };

  const handleTransferAmount = (fromId: string, toId: string, amount: number) => {
    const updatedPeople = transferAmount(people, fromId, toId, amount);
    setPeople(updatedPeople);
  };

  const saveCalculation = () => {
    if (!restaurantName.trim()) {
      alert('Por favor, insira o nome do restaurante');
      return;
    }

    const calculation: BillCalculation = {
      id: Date.now().toString(),
      restaurantName: restaurantName.trim(),
      date: new Date().toISOString(),
      totalAmount,
      numberOfPeople,
      tipPercentage,
      serviceRate,
      discount,
      isDiscountPercentage,
      currency,
      people: [...people],
      mode,
      finalTotal
    };

    setCalculations(prev => [calculation, ...prev]);
    setRestaurantName('');
    alert('Cálculo salvo com sucesso!');
  };

  const loadCalculation = (calc: BillCalculation) => {
    setMode(calc.mode);
    setTotalAmount(calc.totalAmount);
    setNumberOfPeople(calc.numberOfPeople);
    setTipPercentage(calc.tipPercentage);
    setServiceRate(calc.serviceRate);
    setDiscount(calc.discount);
    setIsDiscountPercentage(calc.isDiscountPercentage);
    setCurrency(calc.currency);
    setPeople([...calc.people]);
  };

  const deleteCalculation = (id: string) => {
    setCalculations(prev => prev.filter(calc => calc.id !== id));
  };

  const amountPerPerson = finalTotal / numberOfPeople;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
      <div className="flex items-center space-x-4 flex-shrink-0">
        <div className="p-2 rounded-xl">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            Racha Fácil
          </h1>
         <p className="text-gray-600 text-xs sm:text-base break-words sm:whitespace-nowrap">
  Calculadora - Rápido, justo e sem confusão
</p>

        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-orange-100 p-1 rounded-lg mt-2 sm:mt-0">
        <button
          onClick={() => handleModeSwitch('quick')}
          className={`flex items-center space-x-2 px-4 py-1 rounded-lg transition-all ${
            mode === 'quick'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-orange-600 hover:text-orange-800'
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>Rápido</span>
        </button>
        <button
          onClick={() => handleModeSwitch('advanced')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            mode === 'advanced'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Avançado</span>
        </button>
      </div>
    </div>
  </div>
</header>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="xl:col-span-2 space-y-8">
            {mode === 'quick' ? (
              <QuickMode
                totalAmount={totalAmount}
                setTotalAmount={setTotalAmount}
                numberOfPeople={numberOfPeople}
                setNumberOfPeople={setNumberOfPeople}
                tipPercentage={tipPercentage}
                setTipPercentage={setTipPercentage}
                currency={currency}
                finalTotal={finalTotal}
                amountPerPerson={amountPerPerson}
              />
            ) : (
              <>
                {/* Campos básicos no modo avançado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-4">Gorjeta (%)</h3>
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

                <AdvancedMode
                  people={people}
                  setPeople={setPeople}
                  serviceRate={serviceRate}
                  setServiceRate={setServiceRate}
                  discount={discount}
                  setDiscount={setDiscount}
                  isDiscountPercentage={isDiscountPercentage}
                  setIsDiscountPercentage={setIsDiscountPercentage}
                  currency={currency}
                  onTransferAmount={handleTransferAmount}
                />
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BillSummary
              totalAmount={totalAmount}
              tipPercentage={tipPercentage}
              serviceRate={serviceRate}
              discount={discount}
              isDiscountPercentage={isDiscountPercentage}
              finalTotal={finalTotal}
              people={people}
              currency={currency}
            />

            <CurrencyConverter
              currency={currency}
              setCurrency={setCurrency}
              amount={finalTotal}
            />

            {mode === 'advanced' && (
              <RoundingControls
                people={people}
                setPeople={setPeople}
              />
            )}

            {/* Salvar Cálculo */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Salvar Cálculo</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="Nome do restaurante"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={saveCalculation}
                  disabled={!restaurantName.trim() || totalAmount <= 0}
                  className="w-full flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                >
                  <Save className="h-4 w-4" />
                  <span>Salvar</span>
                </button>
              </div>
            </div>

            <HistoryPanel
              calculations={calculations}
              onLoadCalculation={loadCalculation}
              onDeleteCalculation={deleteCalculation}
            />
          </div>
        </div>
      </main>

      <footer className="bg-orange-600 border-t border-gray-200 py-4 mt-8">
      <div className="max-w-7xl mx-auto px-10 text-center text-white text-base select-none">
        Desenvolvido por <strong>Priscila Ramonna</strong>
      </div>
    </footer>
    </div>
  );
}

export default App;