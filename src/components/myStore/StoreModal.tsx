import React from 'react';
import {
  X,
  Store,
  Phone,
  Share2,
  MapPin,
  Plus,
  Pencil,
  Save,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Camera as SnapchatIcon,
  Youtube as YoutubeIcon,
  Twitter as TwitterIcon,
} from 'lucide-react';
import type { Store as StoreType } from '../../types/store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (store: StoreType) => void;
  store?: StoreType | null;
}

const EMPTY_STORE: StoreType = {
  id: '',
  name: '',
  storeLink: '',
  phone: '',
  email: '',
  whatsapp: '',
  productPageLink: '',
  instagram: '',
  snapchat: '',
  facebook: '',
  youtube: '',
  twitter: '',
  address: '',
};

export default function StoreModal({ isOpen, onClose, onSave, store }: Props) {
  const [formData, setFormData] = React.useState<StoreType>(store || EMPTY_STORE);

  React.useEffect(() => {
    if (store) {
      setFormData(store);
    } else {
      setFormData(EMPTY_STORE);
    }
  }, [store]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden border border-purple-100">
        {/* Header */}
        <div
          className="px-8 py-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
      from-purple-900 via-slate-900 to-black flex items-center justify-between"
        >
          <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
            {store ? <Pencil className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            {store ? 'Edit Store' : 'Add New Store'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Store className="w-5 h-5 text-[#5D1C83]" />
                <h3 className="text-base font-semibold text-gray-900">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Store Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] transition-all placeholder-gray-400"
                    placeholder="Enter store name..."
                    required
                    minLength={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Store Link</label>
                  <input
                    type="text"
                    value={formData.storeLink}
                    onChange={e => setFormData(prev => ({ ...prev, storeLink: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] placeholder-gray-400"
                    placeholder="Store URL (optional)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Product Page Link
                  </label>
                  <input
                    type="text"
                    value={formData.productPageLink}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, productPageLink: e.target.value }))
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] placeholder-gray-400"
                    placeholder="Product page URL (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Phone className="w-5 h-5 text-[#5D1C83]" />
                <h3 className="text-base font-semibold text-gray-900">Contact Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] placeholder-gray-400"
                    placeholder="Phone number (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] placeholder-gray-400"
                    placeholder="Email address (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={e => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] placeholder-gray-400"
                    placeholder="WhatsApp number (optional)"
                  />
                </div>
                {/* Physical Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Physical Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] h-24 resize-none transition-all"
                    placeholder="Store's physical address (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Share2 className="w-5 h-5 text-[#5D1C83]" />
                <h3 className="text-base font-semibold text-gray-900">Social Media & Links</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Instagram</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <InstagramIcon className="w-4 h-4 text-[#E4405F]" />
                    </div>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={e => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
                      placeholder="Instagram profile URL"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Snapchat</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <SnapchatIcon className="w-4 h-4 text-[#FFFC00] border border-black rounded" />
                    </div>
                    <input
                      type="text"
                      value={formData.snapchat}
                      onChange={e => setFormData(prev => ({ ...prev, snapchat: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
                      placeholder="Snapchat profile URL"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Facebook</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <FacebookIcon className="w-4 h-4 text-[#1877F2]" />
                    </div>
                    <input
                      type="text"
                      value={formData.facebook}
                      onChange={e => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
                      placeholder="Facebook page URL"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">YouTube</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <YoutubeIcon className="w-4 h-4 text-[#FF0000]" />
                    </div>
                    <input
                      type="text"
                      value={formData.youtube}
                      onChange={e => setFormData(prev => ({ ...prev, youtube: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
                      placeholder="YouTube channel URL"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Twitter</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <TwitterIcon className="w-4 h-4 text-[#1DA1F2]" />
                    </div>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={e => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
                      placeholder="Twitter profile URL"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-3 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#5D1C83] text-white rounded-lg hover:bg-[#4D0C73] transition-all font-medium flex items-center gap-2"
              >
                {store ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {store ? 'Update Store' : 'Add Store'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
