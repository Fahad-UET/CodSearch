import React, { useState } from 'react';
import { AuthModal } from '../components/AuthModal';

export function AuthLayout() {
  const [showAuthModal, setShowAuthModal] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">CoD-Track.com</h1>
        <button
          onClick={() => setShowAuthModal(true)}
          className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors shadow-lg"
        >
          Sign In to Continue
        </button>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    </div>
  );
}