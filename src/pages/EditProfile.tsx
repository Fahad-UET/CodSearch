import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, BookOpen } from 'lucide-react';
import { useAuthState } from '../hooks/useAuthState';
import { useProductStore } from '../store';
import { useSubscriptionStore } from '../store/subscriptionStore';

export default function EditProfile() {
  const { isLoading } = useAuthState();
  const navigate = useNavigate();
  const { currentSubscription } = useSubscriptionStore();
  const { products, user } = useProductStore();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-gray-600" />
          <h1 className="text-2xl font-semibold">Edit Profile</h1>
        </div>
        
        <div className="space-y-6">
          <Link 
            to="/boards" 
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>My Boards</span>
          </Link>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{user?.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Subscription Status</label>
            <p className="mt-1 text-gray-900">
              {currentSubscription?.status || 'No active subscription'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Products</label>
            <p className="mt-1 text-gray-900">{products.length} products tracked</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            <div className="space-y-4">
              {/* Add preference settings here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}