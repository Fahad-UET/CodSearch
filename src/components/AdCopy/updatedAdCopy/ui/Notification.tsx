import { useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface Props {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Notification({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
          type === 'success'
            ? 'bg-gradient-to-r from-emerald-500/95 to-emerald-600/95 border-emerald-400/20'
            : 'bg-gradient-to-r from-red-500/95 to-red-600/95 border-red-400/20'
        } backdrop-blur-sm text-white min-w-[300px]`}
      >
        <div
          className={`p-1 rounded-full ${
            type === 'success' ? 'bg-emerald-400/20' : 'bg-red-400/20'
          }`}
        >
          {type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </div>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
