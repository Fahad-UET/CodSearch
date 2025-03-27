import React, { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { CalculationForm } from './components/CalculationForm';
import { CalculationResults } from './components/CalculationResults';
import { useCalculation } from './hooks/useCalculation';
import { useSourcingData } from './hooks/useSourcingData';
import { SourcingFormData } from './types';
import { useProductStore } from '../../store';
import { updateProduct as updateProductService } from '../../services/firebase';

interface SourcingCalculatorProps {
  onPriceCalculated?: (price: number) => void;
  onClose: () => void;
  productId: any;
  product?: any;
}

const DEFAULT_FORM_DATA: SourcingFormData = {
  alibabaPrice: 0,
  chargeableWeight: 0,
  shippingMethod: 'air',
  customsDutyRate: 5,
  vatRate: 15,
  declaredValue: 0,
  shippingRate: 10,
};

export function SourcingCalculator({
  onPriceCalculated,
  onClose,
  productId,
  product,
}: SourcingCalculatorProps) {
  const { user, updateProduct } = useProductStore();
  const [inputValue, setInputValue] = useState<string>('0');

  const [volumetricWeight, setVolumetricWeight] = useState(
    product?.sourceCalculation?.volumetricWeight || 0
  );
  const [formData, setFormData] = useState<SourcingFormData>({
    alibabaPrice: product?.sourceCalculation?.alibabaPrice || DEFAULT_FORM_DATA.alibabaPrice,
    chargeableWeight:
      product?.sourceCalculation?.chargeableWeight || DEFAULT_FORM_DATA.chargeableWeight,
    shippingMethod: product?.sourceCalculation?.shippingMethod || DEFAULT_FORM_DATA.shippingMethod,
    customsDutyRate:
      product?.sourceCalculation?.customsDutyRate || DEFAULT_FORM_DATA.customsDutyRate,
    vatRate: product?.sourceCalculation?.vatRate || DEFAULT_FORM_DATA.vatRate,
    declaredValue: product?.sourceCalculation?.declaredValue || DEFAULT_FORM_DATA.declaredValue,
    shippingRate: product?.sourceCalculation?.shippingRate || DEFAULT_FORM_DATA.shippingRate,
  });

  const [dimensions, setDimensions] = useState({
    length: product?.sourceCalculation?.dimensions?.length || 0,
    width: product?.sourceCalculation?.dimensions?.width || 0,
    height: product?.sourceCalculation?.dimensions?.height || 0,
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const { result, error: calculationError, calculate } = useCalculation();
  const {
    savedCalculation,
    isLoading,
    error: dataError,
    saveCalculation,
  } = useSourcingData(user?.uid);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleCalculate = () => {};

  useEffect(() => {
    if (!user) {
      onClose();
      return;
    }

    const ClonedFormData = {
      ...formData,
      chargeableWeight: isNaN(formData.chargeableWeight)
        ? volumetricWeight
        : Math.max(formData.chargeableWeight, volumetricWeight),
    };

    const calculationResult = calculate(ClonedFormData);
  }, [formData, volumetricWeight, user, onClose]);

  const handleSave = async () => {
    if (!result || !user) return;
    try {
      const dataToBeUpdated = { ...formData, volumetricWeight: volumetricWeight, dimensions };

      const updatedProduct = await updateProductService(productId, {
        sourceCalculation: dataToBeUpdated,
      });
      await saveCalculation(result);

      updateProduct(productId, { sourceCalculation: dataToBeUpdated });

      onPriceCalculated?.(result.totalPrice);

      setFormData(DEFAULT_FORM_DATA);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const validateForm = () => {
    const {
      alibabaPrice,
      chargeableWeight,
      customsDutyRate,
      vatRate,
      declaredValue,
      shippingRate,
    } = formData;

    // Validation condition: alibabaPrice > 0 and either realWeight is > 0 or all dimensions are > 0
    const isValid =
      !isNaN(alibabaPrice) &&
      alibabaPrice > 0 &&
      !isNaN(customsDutyRate) &&
      customsDutyRate > 0 &&
      !isNaN(vatRate) &&
      vatRate > 0 &&
      !isNaN(shippingRate) &&
      shippingRate > 0 &&
      ((!isNaN(chargeableWeight) && chargeableWeight >= 0) ||
        (!isNaN(volumetricWeight) && volumetricWeight > 0));

    setIsFormValid(isValid);
  };

  // UseEffect to validate form on initial render or form data changes
  useEffect(() => {
    validateForm();
  }, [formData]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      shippingRate: prev.shippingMethod === 'air' ? 10 : 5,
    }));
  }, [formData.shippingMethod]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Sourcing Price Calculator</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        {(calculationError || dataError) && (
          <div className="p-4 mx-6 mt-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {calculationError || dataError}
          </div>
        )}

        <div className="p-6 grid grid-cols-2 gap-8 max-h-[calc(90vh-129px)] overflow-y-auto">
          <div>
            <CalculationForm
              inputValue={inputValue}
              handleInputChange={handleInputChange}
              formData={formData}
              onChange={updates => setFormData(prev => ({ ...prev, ...updates }))}
              onSubmit={handleCalculate}
              isLoading={isLoading}
              setVolumetricWeight={setVolumetricWeight}
              setDimensions={setDimensions}
              dimensions={dimensions}
            />
          </div>

          <div>
            {result && (
              <CalculationResults
                isFormValid={isFormValid}
                result={result}
                onSave={handleSave}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
