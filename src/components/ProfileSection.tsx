import React, { useState } from 'react';
import { Camera, X, Crown, Package, Grid, List, ArrowRight, User, BookOpen } from 'lucide-react';
import { useProductStore } from '../store';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { updateProfile } from '../services/firebase';
import { SubscriptionPlans } from './SubscriptionPlans';
import { useLanguageStore } from '../store/languageStore';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, CreditCard, FileText } from 'lucide-react';

interface ProfileSectionProps {
  onClose: () => void;
}

export function ProfileSection({ onClose }: ProfileSectionProps) {
  // to resolve build issue please check this
  // const { user, userProfile, setUserProfile, userPackage } = useProductStore();
  const { user, userPackage } = useProductStore();
  const { tiers, currentSubscription } = useSubscriptionStore();
  const [isEditing, setIsEditing] = useState(false);
  // to resolve build issue please check this
  // const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  // const [lastName, setLastName] = useState(userProfile?.lastName || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPlans, setShowPlans] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  const currentTier = tiers.find(tier => tier.id === currentSubscription?.tierId);
  const products = useProductStore(state => state.getAllProducts());
  const productCount = products.length;
  const remainingProducts = currentTier ? currentTier.productLimit - productCount : 0;
  const boardLimit = parseInt(
    currentTier?.features.find(f => f.includes('Board'))?.split(' ')[0] || '1'
  );
  const listLimit = parseInt(
    currentTier?.features.find(f => f.includes('List'))?.split(' ')[0] || '5'
  );
  // to resolve build issue please check this
  // const boards = useProductStore(state => state.boards);
  const boards = useProductStore(state => state.board);
  const lists = useProductStore(state => state.lists);
  const remainingBoards = boardLimit - (boards?.length || 0);
  const remainingLists = listLimit - (lists?.length || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedProfile = await updateProfile(user.uid, {
        firstName,
        lastName,
        photoURL: '',
        // to resolve build issue please check this
        // photoURL: userProfile?.photoURL || '',
        uid: user.uid,
      });
// to resolve build issue please check this
      // setUserProfile(updatedProfile);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'product-research-tracker');

      const response = await fetch('https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      const updatedProfile = await updateProfile(user.uid, {
        // to resolve build issue please check this
        // ...userProfile!,
        photoURL: data.secure_url,
      });
// to resolve build issue please check this
      // setUserProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  if (showPlans) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
        <div className="bg-white rounded-xl w-full max-w-6xl">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold">Change Subscription Plan</h2>
            <button
              onClick={() => setShowPlans(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>
          <SubscriptionPlans />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Subscription Info */}
        <div className="p-6 border-b bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Crown size={20} className="text-purple-600" />
              <h3 className="font-semibold text-gray-900">Current Plan</h3>
            </div>
            <a
              href="https://www.cod-as.com/subscription-plan-2/"
              target="_blank"
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              Change Plan
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-gray-900">{userPackage?.plan || 'Free'}</span>
              <span className="text-purple-600 font-medium">
                ${userPackage?.price || 0}/{userPackage?.type === 'year' ? 'year' : 'mo'}
              </span>
            </div>

            {/* <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-purple-600" /> 
                <span className="text-sm text-gray-600">
                  {t('remainingProducts')}: {remainingProducts}
                </span>
              </div>
            </div> */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Grid size={16} className="text-indigo-600" />
                <span className="text-sm text-gray-600">
                  {t('remainingCredits')}: {userPackage?.credits}
                </span>
              </div>
            </div>
            {/* <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <List size={16} className="text-blue-600" />
                <span className="text-sm text-gray-600">
                  {t('remainingLists')}: {remainingLists}
                </span>
              </div>
            </div> */}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

          <div className="flex justify-center">
            <div className="relative">
            {/* // to resolve build issue please check this */}
              {/* {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt={`${userProfile.firstName} ${userProfile.lastName}`}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : ( */}
                <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-3xl font-semibold text-purple-600">
                    {user.email?.[0]?.toUpperCase()}
                    {/* // to resolve build issue please check this */}
                    {/* {userProfile?.firstName?.[0] || user.email?.[0]?.toUpperCase()} */}
                  </span>
                </div>
              {/* )} */}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                <Camera size={16} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
          </div> */}
          {/* <div>
            <p className="block text-sm font-medium text-gray-700 mb-1">
              UserName
            </p>
            <p className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200">
              User
            </p>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="w-full rounded-lg border-gray-300 bg-gray-50"
            />
          </div>
          <div>
            <a
              href="https://www.cod-as.com/wp-login.php?action=lostpassword"
              target="_blank"
              className="text-md text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              Change Password
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            {/* <a
              href='' target="_blank"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Change Password
            </a> */}
          </div>
        </form>
      </div>
    </div>
  );
}
