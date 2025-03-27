import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface ApiKeyInputProps {
  label: string;
  placeholder: string;
  onSave?: (value: string) => Promise<void>;
  onVerify?: (value: string) => Promise<boolean>;
  onChange: (value: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  label,
  placeholder,
  onSave,
  onVerify,
  onChange,
}) => {
  const [showKey, setShowKey] = useState(false);
  const [value, setValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onChange(newValue);
    setIsConnected(false);
  };

  const handleVerify = async () => {
    if (!onVerify || !value) return;
    
    setIsVerifying(true);
    try {
      const isValid = await onVerify(value);
      setIsConnected(isValid);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSave = async () => {
    if (!onSave || !value) return;
    
    setIsSaving(true);
    try {
      await onSave(value);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm mb-2">
        <input
          type={showKey ? 'text' : 'password'}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="block w-full pr-10 sm:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute inset-y-0 right-0 px-3 flex items-center bg-transparent border-0"
        >
          {showKey ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>
      <div className="flex space-x-2">
        {onVerify && (
          <button
            onClick={handleVerify}
            disabled={!value || isVerifying}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md ${
              isConnected
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
          >
            {isVerifying ? (
              'Verifying...'
            ) : isConnected ? (
              'Connected'
            ) : (
              'Verify'
            )}
          </button>
        )}
        {onSave && (
          <button
            onClick={handleSave}
            disabled={!value || isSaving || (onVerify && !isConnected)}
            className="flex-1 px-3 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        )}
      </div>
    </div>
  );
};