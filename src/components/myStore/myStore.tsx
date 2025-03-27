import React, { useState } from 'react';
import {
  Store,
  Building2,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Link as LinkIcon,
  // Social media icons
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Camera as SnapchatIcon,
  Youtube as YoutubeIcon,
  Twitter as TwitterIcon,
  Globe as WebsiteIcon,
  MessageCircle as WhatsAppIcon,
  ArrowLeft,
} from 'lucide-react';
import type { Store as StoreType } from '../../types/store';
import StoreModal from './StoreModal';
import {
  createStore,
  deleteStore,
  getStoresByUserId,
  updateStore,
} from '@/services/firebase/storeService';
import { useProductStore } from '@/store';
import { useShowStore } from '@/store/showStore';
import { error } from 'console';
import { createTextEdit, getTextEditsByUserId, updateTextEdit } from '@/services/firebase/editText';

interface propsType {
  onClose: () => void;
}

export default function MyStores({ onClose }: propsType) {
  const { user } = useProductStore();
  const { showStore, setShowStore } = useShowStore();

  const [stores, setStores] = useState<StoreType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreType | null>(null);

  // Save stores to localStorage whenever they change
  React.useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const data = await getTextEditsByUserId(user.uid);
        setShowStore(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStoreDetails();
  }, [stores]);

  const handleSave = async (store: StoreType) => {
    if (editingStore) {
      await updateTextEdit(editingStore.id, {
        ...store,
      });
      // .then(updated => console.log('updated', updated))
      // .catch(error => console.log('updated errore', error));
      const updatedData = showStore.map(s =>
        s.id === editingStore.id ? { ...store, id: editingStore.id } : s
      );
      setShowStore(updatedData);
    } else {
      const uniqueId = `text-${crypto.randomUUID()}`;
      await createTextEdit(user.uid, { ...store, id: uniqueId, storeId: uniqueId })
        .then()
        .catch(error => console.log(error));
      setStores(prev => [...prev, { ...store, id: uniqueId, storeId: uniqueId }]);
    }
    setShowModal(false);
    setEditingStore(null);
  };

  const handleEdit = (store: StoreType) => {
    setEditingStore(store);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStore(id)
        .then()
        .catch(error => console.log('deleted error', error));
      const updatedData = showStore.filter(store => store.id !== id);
      setShowStore(updatedData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
      from-purple-900 via-slate-900 to-black p-8 fixed  top-0 left-0 w-full h-full z-[435454545]"
    >
      <button
        onClick={onClose}
        className="text-[#000000] hover:bg-white/10 p-2 rounded-lg transition-colors flex gap-1 items-center"
      >
        <ArrowLeft color="#FFFFFF" size={24} />
        <h2 className="text-xl font-medium text-white">Back</h2>
      </button>
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">My Stores</h1>
          </div>
          <button
            onClick={() => {
              setEditingStore(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#5D1C83] rounded-lg hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Store
          </button>
        </div>
        {showStore?.length > 0 && (
          <div className="h-[80vh] overflow-auto pr-5">
            {/* Stores Grid */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showStore.map(store => (
                <div
                  key={store.id}
                  className="bg-white rounded-xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Store Header */}
                  <div className="p-6 bg-gradient-to-r from-[#4B2A85] to-[#8A1C66]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-6 h-6 text-white" />
                        <h2 className="text-xl font-semibold text-white">{store.name}</h2>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(store)}
                          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                          title="Edit store"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(store.id)}
                          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                          title="Delete store"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <a
                      href={store.storeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Store
                    </a>
                  </div>

                  {/* Store Info */}
                  <div className="p-6 space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                      <div className="space-y-2">
                        <a
                          href={`tel:${store.phone}`}
                          className="flex items-center gap-2 text-gray-600 hover:text-[#5D1C83]"
                        >
                          <Phone className="w-4 h-4" />
                          <span>{store.phone}</span>
                        </a>
                        <a
                          href={`mailto:${store.email}`}
                          className="flex items-center gap-2 text-gray-600 hover:text-[#5D1C83]"
                        >
                          <Mail className="w-4 h-4" />
                          <span>{store.email}</span>
                        </a>
                        <a
                          href={`https://wa.me/${store.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-600 hover:text-[#25D366]"
                        >
                          <WhatsAppIcon className="w-4 h-4" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Store Links</h3>
                      <div className="space-y-2">
                        <a
                          href={store.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-600 hover:text-[#E4405F]"
                        >
                          <InstagramIcon className="w-4 h-4" />
                          <span>Instagram</span>
                        </a>
                        <a
                          href={store.snapchat}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-600 hover:text-[#FFFC00]"
                        >
                          <SnapchatIcon className="w-4 h-4 border border-black rounded" />
                          <span>Snapchat</span>
                        </a>
                        <a
                          href={store.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-600 hover:text-[#1877F2]"
                        >
                          <FacebookIcon className="w-4 h-4" />
                          <span>Facebook</span>
                        </a>
                        {store.youtube && (
                          <a
                            href={store.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-600 hover:text-[#FF0000]"
                          >
                            <YoutubeIcon className="w-4 h-4" />
                            <span>YouTube</span>
                          </a>
                        )}
                        {store.twitter && (
                          <a
                            href={store.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-600 hover:text-[#1DA1F2]"
                          >
                            <TwitterIcon className="w-4 h-4" />
                            <span>Twitter</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2 mt-4">
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{store.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {showStore.length === 0 && (
          <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <Store className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">
              No stores added yet. Click the "Add Store" button to get started.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Store Modal */}
      <StoreModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingStore(null);
        }}
        onSave={handleSave}
        store={editingStore}
      />
    </div>
  );
}
