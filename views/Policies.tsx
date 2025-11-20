import React from 'react';
import { Policy } from '../types';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface PoliciesProps {
  policies: Policy[];
}

export const Policies: React.FC<PoliciesProps> = ({ policies }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Policies</h2>

      {policies.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <Clock className="text-gray-400" size={32} />
          </div>
          <p className="text-gray-500">No policies found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {policies.map((policy) => (
            <div key={policy.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-500 font-mono mb-1">{policy.id}</p>
                  <h3 className="font-bold text-gray-900">{policy.tripCategory}</h3>
                </div>
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                    policy.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                    {policy.status}
                </span>
              </div>
              
              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                    <span className="text-gray-400">Plate:</span>
                    <span className="font-mono font-semibold">{policy.plateNumber}</span>
                </div>
                 <div className="flex items-center gap-1">
                    <span className="text-gray-400">Start:</span>
                    <span>{new Date(policy.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-500 mb-2">Insured Passengers ({policy.passengers.length})</p>
                <div className="flex flex-wrap gap-2">
                    {policy.passengers.map((p, idx) => (
                        <span key={idx} className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-700 border border-gray-100">
                            {p.name}
                        </span>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};