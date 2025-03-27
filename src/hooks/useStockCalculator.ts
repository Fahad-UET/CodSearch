import { useState, useEffect } from 'react';
import { useKpiStore } from '../store/kpiStore';
import { calculateStock, calculateRequiredLeads, getEffectiveRate } from '../utils/stockCalculations';

interface UseStockCalculatorProps {
  initialStock?: number;
  initialLeads?: number;
  selectedCountry: string;
}

export function useStockCalculator({ 
  initialStock = 100,
  initialLeads,
  selectedCountry 
}: UseStockCalculatorProps) {
  const { getCountrySettings } = useKpiStore();
  const [stock, setStock] = useState(initialStock);
  const [leads, setLeads] = useState(0);
  const [isStockMode, setIsStockMode] = useState(true);

  // Get KPI settings for the selected country
  const kpiSettings = getCountrySettings(selectedCountry);
  const effectiveDeliveryRate = getEffectiveRate(kpiSettings.deliveryRate);
  const effectiveConfirmationRate = getEffectiveRate(kpiSettings.confirmationRate);

  // Initialize leads based on initial stock or provided leads
  useEffect(() => {
    if (initialLeads !== undefined) {
      setLeads(initialLeads);
      setIsStockMode(false);
      
      // Calculate resulting stock
      const result = calculateStock(
        initialLeads,
        effectiveDeliveryRate,
        effectiveConfirmationRate
      );
      setStock(result.stock);
    } else {
      // Calculate required leads from initial stock
      const requiredLeads = calculateRequiredLeads(
        initialStock,
        effectiveDeliveryRate,
        effectiveConfirmationRate
      );
      setLeads(requiredLeads);
      setIsStockMode(true);
    }
  }, [initialStock, initialLeads, effectiveDeliveryRate, effectiveConfirmationRate]);

  // Recalculate when rates change
  useEffect(() => {
    if (isStockMode) {
      // When in stock mode, recalculate required leads
      const requiredLeads = calculateRequiredLeads(
        stock,
        effectiveDeliveryRate,
        effectiveConfirmationRate
      );
      setLeads(requiredLeads);
    } else {
      // When in leads mode, recalculate resulting stock
      const result = calculateStock(
        leads,
        effectiveDeliveryRate,
        effectiveConfirmationRate
      );
      setStock(result.stock);
    }
  }, [effectiveDeliveryRate, effectiveConfirmationRate, isStockMode, stock, leads]);

  const handleStockChange = (newStock: number) => {
    setIsStockMode(true);
    setStock(newStock);
    
    // Calculate required leads based on new stock
    const requiredLeads = calculateRequiredLeads(
      newStock,
      effectiveDeliveryRate,
      effectiveConfirmationRate
    );
    setLeads(requiredLeads);
  };

  const handleLeadsChange = (newLeads: number) => {
    setIsStockMode(false);
    setLeads(newLeads);
    
    // Calculate resulting stock based on new leads
    const result = calculateStock(
      newLeads,
      effectiveDeliveryRate,
      effectiveConfirmationRate
    );
    setStock(result.stock);
  };

  const calculations = calculateStock(
    leads,
    effectiveDeliveryRate,
    effectiveConfirmationRate
  );

  return {
    stock,
    leads,
    expectedDeliveries: calculations.expectedDeliveries,
    expectedReturns: calculations.expectedReturns,
    deliveryRate: effectiveDeliveryRate,
    confirmationRate: effectiveConfirmationRate,
    onStockChange: handleStockChange,
    onLeadsChange: handleLeadsChange,
    isStockMode
  };
}