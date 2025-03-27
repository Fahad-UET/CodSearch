import React from 'react';
import { Plus } from 'lucide-react';
import { MetricsState } from '../types';

interface RateAdjustmentsProps {
  metrics: MetricsState;
  onChange: (updates: Partial<MetricsState>) => void;
}

export function RateAdjustments({ metrics, onChange }: RateAdjustmentsProps) {
  const handleAddChange = (
    type: keyof Pick<
      MetricsState,
      | 'advertisingChanges'
      | 'confirmationChanges'
      | 'deliveryChanges'
      | 'priceChanges'
      | 'stockChanges'
    >
  ) => {
    const day = Number((document.getElementById(`${type}Day`) as HTMLSelectElement)?.value);
    const value = Number((document.getElementById(`${type}Value`) as HTMLInputElement)?.value);

    if (!day || !value) return;

    onChange({
      [type]: [...metrics[type], { day, value }].sort((a, b) => a.day - b.day),
    });

    // Reset inputs
    if (document.getElementById(`${type}Day`)) {
      (document.getElementById(`${type}Day`) as HTMLSelectElement).value = '';
    }
    if (document.getElementById(`${type}Value`)) {
      (document.getElementById(`${type}Value`) as HTMLInputElement).value = '';
    }
  };

  const handleRemoveChange = (type: keyof MetricsState, day: number) => {
    onChange({
      [type]: metrics[type]?.length && metrics[type].filter((change: any) => change.day !== day),
    });
  };

  const rateGroups = [
    {
      title: 'Advertising & Confirmation',
      items: [
        {
          type: 'advertisingChanges',
          label: 'Advertising Cost Changes',
          color: 'blue',
          placeholder: 'New CPL',
          prefix: '$',
          min: 0,
          step: 0.01,
        },
        // {
        //   type: 'confirmationChanges',
        //   label: 'Confirmation Rate Changes',
        //   color: 'red',
        //   placeholder: 'New Rate %',
        //   suffix: '%',
        //   min: 0,
        //   max: 100,
        // },
        {
          type: 'deliveryChanges',
          label: 'Delivery Rate Changes',
          color: 'green',
          placeholder: 'New Rate %',
          suffix: '%',
          min: 0,
          max: 100,
        },
        {
          type: 'priceChanges',
          label: 'Selling Price Changes',
          color: 'cyan',
          placeholder: 'New Price',
          prefix: '$',
          min: 0,
          step: 0.01,
        },
        {
          type: 'stockChanges',
          label: 'Stock Changes',
          color: 'purple',
          placeholder: 'New Stock',
          suffix: 'units',
          min: 0,
        },
      ],
    },
    // {
    //   title: 'Delivery & Price',
    //   items: [

    //   ],
    // },
    // {
    //   title: 'Stock Management',
    //   items: [],
    // },
  ];

  return (
    <div className="space-y-8">
      {rateGroups.map((group, groupIndex) => (
        <div
          key={group.title}
          className="bg-white/80 rounded-xl p-6 border border-purple-100 shadow-sm"
        >
          {/* <h3 className="text-lg font-semibold text-gray-900 mb-6">{group.title}</h3> */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {group.items.map(item => (
              <div
                key={item.type}
                className={`bg-${item.color}-50 rounded-xl p-4 border border-${item.color}-200`}
              >
                <h4 className={`text-${item.color}-700 font-medium mb-4`}>{item.label}</h4>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <select
                      id={`${item.type}Day`}
                      className={`rounded-lg border-gray-300 focus:border-${item.color}-500 focus:ring focus:ring-${item.color}-200`}
                    >
                      <option value="">Select Day</option>
                      {Array.from({ length: 12 }, (_, i) => (i + 1) * 15).map(day => (
                        <option key={day} value={day}>
                          Day {day}
                        </option>
                      ))}
                    </select>
                    <div className="relative flex-1">
                      <input
                        id={`${item.type}Value`}
                        type="number"
                        min={item.min}
                        max={item.max}
                        step={item.step}
                        placeholder={item.placeholder}
                        className={`w-full rounded-lg border-gray-300 focus:border-${
                          item.color
                        }-500 focus:ring focus:ring-${item.color}-200 ${item.prefix ? 'pl-6' : ''}`}
                      />
                      {item.prefix && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                          {item.prefix}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddChange(item.type as any)}
                      className={`p-2 bg-${item.color}-600 text-white rounded-lg hover:bg-${item.color}-700`}
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {/* Changes List */}
                  <div className="space-y-2">
                    {metrics[item.type].map(change => (
                      <div
                        key={change.day}
                        className={`flex justify-between items-center p-2 bg-${item.color}-100/50 rounded-lg`}
                      >
                        <span>
                          Day {change.day}: {item.prefix || ''}
                          {change.value}
                          {item.suffix || ''}
                        </span>
                        <button
                          onClick={() => handleRemoveChange(item.type as any, change.day)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
