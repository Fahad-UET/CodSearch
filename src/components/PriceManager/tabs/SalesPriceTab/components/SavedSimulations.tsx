import React from 'react';
import { Clock, Star, DollarSign, Trash2 } from 'lucide-react';

interface PriceSimulation {
  id: string;
  salePrice: number;
  confirmationRate: number;
  deliveryRate: number;
  cpl: number;
  profitPerUnit: number;
  createdAt: Date;
}

interface SavedSimulationsProps {
  simulations: PriceSimulation[];
  onSelect: (simulation: PriceSimulation) => void;
  onDelete: (id: string) => void;
  selectedSimulationId?: string;
}

export function SavedSimulations({ 
  simulations, 
  onSelect, 
  onDelete,
  selectedSimulationId 
}: SavedSimulationsProps) {
  return (
    <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
      {simulations.map(simulation => (
        <button
          key={simulation.id}
          onClick={() => onSelect(simulation)}
          className={`w-full p-4 rounded-lg border-2 transition-all ${
            selectedSimulationId === simulation.id
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 hover:border-purple-200 bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <DollarSign 
                size={16} 
                className={selectedSimulationId === simulation.id ? 'text-purple-500' : 'text-gray-400'} 
              />
              <span className="font-medium text-lg">
                ${simulation.salePrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(simulation.id);
              }}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-left">
              <div className="text-gray-500">Conf. Rate</div>
              <div className="font-medium">{simulation.confirmationRate}%</div>
            </div>
            <div className="text-left">
              <div className="text-gray-500">Del. Rate</div>
              <div className="font-medium">{simulation.deliveryRate}%</div>
            </div>
            <div className="text-left">
              <div className="text-gray-500">CPL</div>
              <div className="font-medium">${simulation.cpl.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={12} />
              {new Date(simulation.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Star size={12} />
              ${simulation.profitPerUnit.toFixed(2)}/unit
            </div>
          </div>
        </button>
      ))}

      {simulations.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No saved simulations yet
        </div>
      )}
    </div>
  );
}