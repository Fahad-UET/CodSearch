{
  /* Previous imports remain the same */
}
import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Settings,
  DollarSign,
  Calendar,
  Tag,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Package2,
  Calculator,
  RotateCcw,
} from 'lucide-react';
import { useProductStore } from '../store';
import { CategoryManager } from './CategoryManager';
import { AddChargeForm } from './AddChargeForm';
import { EditChargeModal } from './EditChargeModal';
import { calculateMonthlyAmount } from '../utils/calculations';
import {
  // comment this line as it is not exist in this file and is not using here
  // createMonthlyChargeAPI,
  createOrUpdateMonthlyCharges,
} from '@/services/firebase/monthlyCharges';

interface MonthlyChargesModalProps {
  onClose: () => void;
}

export function MonthlyChargesModal({ onClose }: MonthlyChargesModalProps) {
  const { user } = useProductStore();
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showAddCharge, setShowAddCharge] = useState<{
    categoryId: string;
    subcategoryId: string;
  } | null>(null);
  const [editingCharge, setEditingCharge] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [salesVolume, setSalesVolume] = useState<string>('200');
  const [salesPeriod, setSalesPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);

  const {
    monthlyCharges,
    chargeCategories,
    deleteMonthlyCharge,
    updateMonthlyCharge,
    loadMonthlyCharges,
    loadCategories,
  } = useProductStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([loadMonthlyCharges(), loadCategories()]);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load data');
      }
    };

    loadData();
  }, [loadMonthlyCharges, loadCategories]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleToggleCharge = async (charge: any) => {
    try {
      await updateMonthlyCharge(charge.id, {
        isActive: !charge.isActive,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle charge');
    }
  };

  const handleDeleteCharge = async (chargeId: string) => {
    try {
      await deleteMonthlyCharge(chargeId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete charge');
    }
  };

  const calculateCategoryTotal = (categoryId: string) => {
    return monthlyCharges
      .filter(charge => charge.categoryId === categoryId && charge.isActive)
      .reduce((sum, charge) => sum + calculateMonthlyAmount(charge), 0);
  };

  const calculateSubcategoryTotal = (categoryId: string, subcategoryId: string) => {
    return monthlyCharges
      .filter(
        charge =>
          charge.categoryId === categoryId &&
          charge.subcategoryId === subcategoryId &&
          charge.isActive
      )
      .reduce((sum, charge) => sum + calculateMonthlyAmount(charge), 0);
  };

  const totalMonthly = monthlyCharges
    .filter(charge => charge.isActive)
    .reduce((sum, charge) => sum + calculateMonthlyAmount(charge), 0);

  // Calculate monthly sales based on period
  const getMonthlySales = () => {
    const volume = parseFloat(salesVolume) || 0;
    switch (salesPeriod) {
      case 'daily':
        return volume * 30; // 30 days per month
      case 'weekly':
        return volume * 4; // 4 weeks per month
      case 'monthly':
        return volume;
      default:
        return volume;
    }
  };

  const monthlySales = getMonthlySales();
  const chargePerProduct = monthlySales > 0 ? totalMonthly / monthlySales : 0;

  const handleSalesVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSalesVolume(value);
    }
  };

  const handleResetCalculator = () => {
    setSalesVolume('200');
    setSalesPeriod('monthly');
  };

  const handleSaveChargePerProduct = async () => {
    try {
      setIsLoading(true);
      await createOrUpdateMonthlyCharges(user.uid, chargePerProduct);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-xl w-full max-w-4xl shadow-xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Monthly Charges</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your recurring expenses</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCategoryManager(true)}
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Settings size={20} className="inline-block mr-2" />
              Manage Categories
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-73px)]">
          <div className="p-6 space-y-6 mb-5">
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-6">
              {/* Total Monthly Expenses */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Total Monthly Expenses</h3>
                  <div className="flex items-center gap-2">
                    <DollarSign size={24} className="text-white/80" />
                    <p className="text-3xl font-bold text-white">${totalMonthly.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Per Product Calculator */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-xl shadow-lg">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Charge Per Product</h3>
                    <div className="flex items-center gap-2">
                      <DollarSign size={24} className="text-white/80" />
                      <p className="text-3xl font-bold text-white">
                        ${chargePerProduct.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={salesVolume}
                        onChange={handleSalesVolumeChange}
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                        placeholder="Sales volume"
                      />
                      <Package2
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
                      />
                    </div>
                    <select
                      value={salesPeriod}
                      onChange={e =>
                        setSalesPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')
                      }
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 [&>option]:bg-emerald-700 [&>option]:text-white"
                    >
                      <option value="daily">per day</option>
                      <option value="weekly">per week</option>
                      <option value="monthly">per month</option>
                    </select>
                    <button
                      onClick={handleResetCalculator}
                      className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Reset calculator"
                    >
                      <RotateCcw size={20} />
                    </button>
                  </div>
                  <p className="text-sm text-white/80">
                    Monthly volume: {monthlySales.toLocaleString()} products
                  </p>
                </div>
                <button
                  onClick={handleSaveChargePerProduct}
                  className="px-4 py-1 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 [&>option]:bg-emerald-700 [&>option]:text-white mx-auto mt-3"
                >
                  {isLoading ? 'Saving..' : 'Save'}
                </button>
              </div>
            </div>

            {/* Categories and Charges */}
            <div className="space-y-4">
              {chargeCategories.map(category => (
                <div
                  key={category.id}
                  className="rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-200"
                >
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full p-4 bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-between text-white transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between flex-1 mr-4">
                      <h3 className="text-lg font-semibold">{category.label}</h3>
                      <div className="flex items-center gap-2">
                        <DollarSign size={20} className="text-white/80" />
                        <span className="text-xl font-bold">
                          ${calculateCategoryTotal(category.id).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Rest of the category content remains the same */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      expandedCategories.has(category.id)
                        ? 'max-h-[1000px] opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-4 space-y-4 bg-white">
                      {category.subcategories?.map((subcategory: any) => (
                        <div key={subcategory.id} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center justify-between flex-1 mr-4">
                              <h4 className="text-sm font-medium text-gray-700">
                                {subcategory.label}
                              </h4>
                              <div className="flex items-center gap-1 text-gray-600">
                                <DollarSign size={16} />
                                <span className="font-medium">
                                  $
                                  {calculateSubcategoryTotal(category.id, subcategory.id).toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                setShowAddCharge({
                                  categoryId: category.id,
                                  subcategoryId: subcategory.id,
                                })
                              }
                              className="px-3 py-1.5 text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-1"
                            >
                              <Plus size={16} />
                              Add Charge
                            </button>
                          </div>

                          <div className="space-y-2">
                            {monthlyCharges
                              .filter(
                                charge =>
                                  charge.categoryId === category.id &&
                                  charge.subcategoryId === subcategory.id
                              )
                              .map(charge => {
                                const monthlyAmount = calculateMonthlyAmount(charge);
                                return (
                                  <div
                                    key={charge.id}
                                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                                      charge.isActive
                                        ? 'bg-gray-50 hover:bg-gray-100'
                                        : 'bg-gray-50/50 hover:bg-gray-100/50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-purple-100 rounded-lg">
                                        <DollarSign size={20} className="text-purple-600" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-900">{charge.name}</p>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                          <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {charge.period}
                                          </span>
                                          {charge.description && (
                                            <span className="flex items-center gap-1">
                                              <Tag size={14} />
                                              {charge.description}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="text-right">
                                        <p className="font-medium text-gray-900">
                                          ${monthlyAmount.toFixed(2)}/month
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          (${charge.amount.toFixed(2)}/{charge.period})
                                          {charge.quantity && charge.quantity > 1 && (
                                            <span> × {charge.quantity}</span>
                                          )}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {/* Toggle Switch */}
                                        <label className="relative inline-flex items-center cursor-pointer">
                                          <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={charge.isActive}
                                            onChange={() => handleToggleCharge(charge)}
                                          />
                                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                        <button
                                          onClick={() => setEditingCharge(charge)}
                                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                          <Edit2 size={20} />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteCharge(charge.id)}
                                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                          <Trash2 size={20} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showCategoryManager && <CategoryManager onClose={() => setShowCategoryManager(false)} />}

      {showAddCharge && (
        <AddChargeForm
          categoryId={showAddCharge.categoryId}
          subcategoryId={showAddCharge.subcategoryId}
          onClose={() => setShowAddCharge(null)}
        />
      )}

      {editingCharge && (
        <EditChargeModal charge={editingCharge} onClose={() => setEditingCharge(null)} />
      )}
    </div>
  );
}
