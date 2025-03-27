import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useProductStore } from '../../store';
import { VerifierResults } from './VerifierResults';
import { VerifierControls } from './VerifierControls';
import { runVerification } from './utils/verification';
import { useAutoRefresh } from './hooks/useAutoRefresh';

interface VerifierProps {
  productId: string;
  onClose: () => void;
}

export function Verifier({ productId, onClose }: VerifierProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const { products } = useProductStore();
  const product = products.find(p => p.id === productId);

  // Auto-refresh hook
  const { 
    isAutoRefresh,
    interval,
    toggleAutoRefresh,
    setInterval 
  } = useAutoRefresh();

  const verify = async () => {
    if (!product) return;
    
    setIsVerifying(true);
    setError(null);
    
    try {
      const verificationResults = await runVerification(product);
      setResults(verificationResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  // Run verification on mount and when auto-refresh is enabled
  useEffect(() => {
    verify();
  }, [product]);

  // Set up auto-refresh interval
  useEffect(() => {
    if (!isAutoRefresh) return;
    verify();
    const timer: any = setInterval(interval * 1000);
    return () => clearInterval(timer);
  }, [isAutoRefresh, interval, product]);

  if (!product) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
        <div className="bg-white rounded-xl p-6 max-w-md w-full">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle size={24} />
            <p>Product not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl w-full max-w-4xl shadow-xl">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Verify Product</h2>
              <p className="text-sm text-gray-500 mt-1">{product.title}</p>
            </div>
            
            <VerifierControls
              isVerifying={isVerifying}
              isAutoRefresh={isAutoRefresh}
              interval={interval}
              onRefresh={verify}
              onToggleAutoRefresh={toggleAutoRefresh}
              onIntervalChange={setInterval}
              onClose={onClose}
            />
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}
        </div>

        <div className="p-6">
          <VerifierResults 
            results={results}
            isLoading={isVerifying}
          />
        </div>
      </div>
    </div>
  );
}