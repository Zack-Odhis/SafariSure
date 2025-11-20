import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { TRIP_TYPES } from '../constants';
import { TripCategory, Passenger, Policy } from '../types';
import { ArrowLeft, User, Car, Calendar, CheckCircle, Sparkles } from 'lucide-react';
import { getTripSafetyAdvice } from '../services/geminiService';

interface PurchaseFlowProps {
  onCancel: () => void;
  onComplete: (policy: Policy) => void;
}

export const PurchaseFlow: React.FC<PurchaseFlowProps> = ({ onCancel, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  
  // Form State
  const [plate, setPlate] = useState('');
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: '1', name: '', nationalId: '', age: '', relation: 'Self' }
  ]);

  // Derived State
  const selectedTrip = TRIP_TYPES.find(t => t.id === selectedTripId);
  const totalCost = selectedTrip ? selectedTrip.price : 0;

  const handleAddPassenger = () => {
    const newId = (passengers.length + 1).toString();
    setPassengers([...passengers, { id: newId, name: '', nationalId: '', age: '', relation: 'Passenger' }]);
  };

  const updatePassenger = (id: string, field: keyof Passenger, value: string) => {
    setPassengers(passengers.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePassenger = (id: string) => {
    if (passengers.length > 1) {
        setPassengers(passengers.filter(p => p.id !== id));
    }
  }

  // Fetch AI advice when reaching summary step
  useEffect(() => {
    if (step === 3 && selectedTrip) {
      const fetchAdvice = async () => {
        const advice = await getTripSafetyAdvice(selectedTrip.name, "Standard trip within Kenya");
        setAiAdvice(advice);
      };
      fetchAdvice();
    }
  }, [step, selectedTrip]);

  const handlePayment = async () => {
    setLoading(true);
    // Simulate M-Pesa Delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newPolicy: Policy = {
      id: `POL-${Math.floor(Math.random() * 10000)}`,
      plateNumber: plate,
      tripCategory: selectedTrip?.name as TripCategory,
      startDate: new Date().toISOString(),
      passengers,
      status: 'ACTIVE',
      totalCost,
    };
    setLoading(false);
    onComplete(newPolicy);
  };

  // Renders
  const renderStepIndicator = () => (
    <div className="flex justify-center items-center space-x-2 mb-6">
      {[1, 2, 3].map((s) => (
        <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${step >= s ? 'w-8 bg-green-600' : 'w-4 bg-gray-200'}`} />
      ))}
    </div>
  );

  if (step === 1) {
    return (
      <div className="p-6">
        <button onClick={onCancel} className="text-gray-400 mb-4 flex items-center gap-1 text-sm font-medium"><ArrowLeft size={16}/> Cancel</button>
        {renderStepIndicator()}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Details</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Plate Number</label>
            <div className="relative">
              <Car className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input 
                type="text" 
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="KAA 123B"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-mono uppercase placeholder-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Trip Category</label>
            <div className="grid gap-3">
              {TRIP_TYPES.map((trip) => (
                <button
                  key={trip.id}
                  onClick={() => setSelectedTripId(trip.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all relative overflow-hidden ${
                    selectedTripId === trip.id 
                      ? 'border-green-600 bg-green-50' 
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                    {selectedTripId === trip.id && (
                        <div className="absolute top-0 right-0 bg-green-600 text-white p-1 rounded-bl-lg">
                            <CheckCircle size={14} />
                        </div>
                    )}
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-900">{trip.name}</span>
                    <span className="font-bold text-green-700">KES {trip.price}</span>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">{trip.maxDistance}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">{trip.validity} valid</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button 
            fullWidth 
            onClick={() => setStep(2)} 
            disabled={!plate || !selectedTripId}
          >
            Next Step
          </Button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="p-6">
        <button onClick={() => setStep(1)} className="text-gray-400 mb-4 flex items-center gap-1 text-sm font-medium"><ArrowLeft size={16}/> Back</button>
        {renderStepIndicator()}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Passengers</h2>
            <span className="text-sm text-gray-500 font-medium">Total: {passengers.length}</span>
        </div>

        <div className="space-y-4 mb-8">
          {passengers.map((passenger, index) => (
            <div key={passenger.id} className="bg-white border border-gray-200 rounded-xl p-4 relative shadow-sm">
                <div className="flex justify-between mb-3">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                        <User size={16} className="text-gray-400"/> 
                        Passenger {index + 1}
                    </h4>
                    {passengers.length > 1 && (
                         <button onClick={() => removePassenger(passenger.id)} className="text-red-400 text-xs font-medium">Remove</button>
                    )}
                </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Full Name"
                  value={passenger.name}
                  onChange={(e) => updatePassenger(passenger.id, 'name', e.target.value)}
                  className="col-span-2 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-green-500 outline-none"
                />
                <input
                  placeholder="ID Number"
                  value={passenger.nationalId}
                  onChange={(e) => updatePassenger(passenger.id, 'nationalId', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-green-500 outline-none"
                />
                <input
                  placeholder="Age"
                  type="number"
                  value={passenger.age}
                  onChange={(e) => updatePassenger(passenger.id, 'age', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
          ))}
          
          <button 
            onClick={handleAddPassenger}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-green-400 hover:text-green-600 transition-colors"
          >
            + Add Another Passenger
          </button>
        </div>

        <div>
             <Button 
                fullWidth 
                onClick={() => setStep(3)}
                disabled={passengers.some(p => !p.name || !p.nationalId || !p.age)}
            >
                Review & Pay
            </Button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="p-6">
        <button onClick={() => setStep(2)} className="text-gray-400 mb-4 flex items-center gap-1 text-sm font-medium"><ArrowLeft size={16}/> Edit Details</button>
        {renderStepIndicator()}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>

        {/* AI Insight Card */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
                <div className="mt-1">
                    <Sparkles className="text-indigo-600" size={18} />
                </div>
                <div>
                    <h4 className="font-bold text-indigo-900 text-sm">AI Travel Insight</h4>
                    <p className="text-indigo-800 text-xs mt-1 leading-relaxed">
                        {aiAdvice || "Analyzing your route safety..."}
                    </p>
                </div>
            </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4 mb-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-gray-500 text-sm">Vehicle</span>
                <span className="font-mono font-bold text-gray-900">{plate}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-gray-500 text-sm">Cover Type</span>
                <span className="font-bold text-gray-900">{selectedTrip?.name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-gray-500 text-sm">Duration</span>
                <span className="font-bold text-gray-900">{selectedTrip?.validity}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Passengers</span>
                <span className="font-bold text-gray-900">{passengers.length}</span>
            </div>
        </div>

        <div className="flex justify-between items-center mb-8 px-2">
            <span className="text-lg font-medium text-gray-700">Total to Pay</span>
            <span className="text-3xl font-bold text-green-600">KES {totalCost}</span>
        </div>

        <Button 
            fullWidth 
            onClick={handlePayment} 
            isLoading={loading}
            className="bg-green-600 hover:bg-green-700"
        >
            Pay with M-Pesa
        </Button>
        <p className="text-center text-xs text-gray-400 mt-4">
            By clicking Pay, you agree to the Terms & Conditions.
        </p>
      </div>
    );
  }

  return null;
};