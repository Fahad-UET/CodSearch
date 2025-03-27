import React from 'react';
import { Settings, Building } from 'lucide-react';

interface ServiceControlsProps {
  productType: 'cosmetic' | 'gadget';
  serviceType: 'with' | 'without';
  onProductTypeChange: (type: 'cosmetic' | 'gadget') => void;
  onServiceTypeChange: (type: 'with' | 'without') => void;
}

export function ServiceControls({
  productType,
  serviceType,
  onProductTypeChange,
  onServiceTypeChange
}: ServiceControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Building size={20} className="text-purple-600" />
        </div>
        <select
          value={productType}
          onChange={(e) => onProductTypeChange(e.target.value as 'cosmetic' | 'gadget')}
          className="rounded-lg border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200 bg-white text-gray-900 font-medium"
        >
          <option value="cosmetic">Cosmetic Product</option>
          <option value="gadget">Gadget Product</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Settings size={20} className="text-indigo-600" />
        </div>
        <select
          value={serviceType}
          onChange={(e) => onServiceTypeChange(e.target.value as 'with' | 'without')}
          className="rounded-lg border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 bg-white text-gray-900 font-medium"
        >
          <option value="with">With Call Center</option>
          <option value="without">Without Call Center</option>
        </select>
      </div>
    </div>
  );
}