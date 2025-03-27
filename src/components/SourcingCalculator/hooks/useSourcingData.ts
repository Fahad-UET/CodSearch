import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase/config';
import { SourcingCalculation, CalculationResult } from '../types';

export function useSourcingData(userId: string | undefined) {
  const [savedCalculation, setSavedCalculation] = useState<SourcingCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    loadSavedCalculation();
  }, [userId]);

  const loadSavedCalculation = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const calculationRef = doc(db, 'users', userId, 'sourcingCalculations', 'latest');
      const calculationSnap = await getDoc(calculationRef);

      if (calculationSnap.exists()) {
        setSavedCalculation(calculationSnap.data() as SourcingCalculation);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load saved calculation');
    } finally {
      setIsLoading(false);
    }
  };

  const saveCalculation = async (result: CalculationResult) => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const calculation: SourcingCalculation = {
        id: `calc-${Date.now()}`,
        userId,
        sourcingPrice: result.totalPrice,
        shippingCost: result.shippingCost,
        customsDuty: result.customsDuty,
        vat: result.vat,
        totalPrice: result.totalPrice,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const calculationRef = doc(db, 'users', userId, 'sourcingCalculations', 'latest');
      await setDoc(calculationRef, calculation);
      setSavedCalculation(calculation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save calculation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    savedCalculation,
    isLoading,
    error,
    saveCalculation,
    loadSavedCalculation
  };
}