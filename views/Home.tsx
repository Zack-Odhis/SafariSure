import React from 'react';
import { Button } from '../components/Button';
import { ViewState, Policy } from '../types';
import { Plus, ShieldCheck, MapPin, Clock, ArrowRight, AlertTriangle } from 'lucide-react';

interface HomeProps {
  setView: (view: ViewState) => void;
  activePolicy?: Policy;
}

export const Home: React.FC<HomeProps> = ({ setView, activePolicy }) => {
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Jambo, Driver! 👋</h2>
        <p className="text-gray-500 mt-1">Ready for your next journey?</p>
      </div>

      {/* Active Policy Card or CTA */}
      {activePolicy && activePolicy.status === 'ACTIVE' ? (
        <div className="bg-green-600 rounded-2xl p-6 text-white shadow-xl shadow-green-600/20 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="bg-green-500/30 px-2 py-1 rounded-md text-xs font-medium border border-green-400/30">
                Active Policy
              </span>
              <h3 className="text-xl font-bold mt-2">{activePolicy.tripCategory}</h3>
            </div>
            <ShieldCheck className="w-8 h-8 text-green-100" />
          </div>
          
          <div className="space-y-2 text-sm text-green-50">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>Valid within Kenya</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Expires in 5 hours</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-green-500/30 flex justify-between items-center">
            <div className="text-xs opacity-80">
              Plate: <span className="font-mono text-base font-semibold">{activePolicy.plateNumber}</span>
            </div>
            <button 
                onClick={() => setView('POLICIES')}
                className="text-xs bg-white text-green-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-green-50"
            >
              View Details
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
           <h3 className="text-lg font-bold mb-2">No Active Cover</h3>
           <p className="text-gray-300 text-sm mb-6">
             Don't drive unprotected. Get instant personal accident cover for you and your passengers.
           </p>
           <Button 
            variant="primary" 
            fullWidth 
            onClick={() => setView('BUY_FLOW')}
            className="bg-white text-green-700 hover:bg-green-50 shadow-none border-none"
           >
             <Plus size={18} /> Get Covered Now
           </Button>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setView('BUY_FLOW')}
            className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2 text-center"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Plus size={20} />
            </div>
            <span className="text-sm font-semibold text-gray-700">New Trip</span>
          </button>
          <button 
            onClick={() => setView('CLAIMS')}
            className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2 text-center"
          >
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                <AlertTriangle size={20} />
            </div>
            <span className="text-sm font-semibold text-gray-700">Report Accident</span>
          </button>
        </div>
      </div>

      {/* Promo / Info */}
      <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
        <div className="flex gap-3">
            <div className="mt-1 bg-orange-200 p-1.5 rounded-full h-fit">
                <ShieldCheck size={14} className="text-orange-700" />
            </div>
            <div>
                <h4 className="font-semibold text-orange-900 text-sm">Why SafariSure?</h4>
                <p className="text-xs text-orange-800/80 mt-1 leading-relaxed">
                    We offer flexible, per-trip insurance. Only pay for what you use. Approved by Kenyan regulatory authorities.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};