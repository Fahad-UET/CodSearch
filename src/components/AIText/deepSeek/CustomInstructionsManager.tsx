import React, { useState } from 'react';
import {
  Plus,
  Star,
  StarOff,
  Pencil,
  Trash2,
  Save,
  X,
  Tag as TagIcon,
  Store,
  Phone,
  Instagram,
  Camera,
  Facebook,
  Youtube,
  Twitter,
  Mail,
  MessageSquare,
  MapPin,
  Settings,
  Edit,
  SaveAllIcon,
} from 'lucide-react';
import { useCustomInstructionsStore } from '@/store/CustomInstructionsStore';
import type { CreateInstructionDto } from '@/types/customInstructions';
import { getStoresByUserId, updateStore } from '@/services/firebase/storeService';
import { useShowStore } from '@/store/showStore';
import { useProductStore } from '@/store';
import { updateTextEdit } from '@/services/firebase/editText';
import type { Store as StoreType } from '@/types/store';


const STORE_INFO_SHORTCUTS = [
  { icon: Store, label: 'Store Name', whcihfield: 'name', placeholder: 'Enter store name...' },
  { icon: Store, label: 'Store Link', whcihfield: 'storeLink', placeholder: 'Store URL' },
  { icon: Phone, label: 'Phone Number', whcihfield: 'phone', placeholder: 'Phone number' },
  {
    icon: Instagram,
    label: 'Instagram',
    whcihfield: 'instagram',
    placeholder: 'Instagram profile URL',
  },
  { icon: Camera, label: 'Snapchat', whcihfield: 'snapchat', placeholder: 'Snapchat profile URL' },
  { icon: Facebook, label: 'Facebook', whcihfield: 'facebook', placeholder: 'Facebook page URL' },
  { icon: Youtube, label: 'YouTube', whcihfield: 'youtube', placeholder: 'YouTube channel URL' },
  { icon: Twitter, label: 'Twitter', whcihfield: 'twitter', placeholder: 'Twitter profile URL' },
  { icon: Mail, label: 'Email', whcihfield: 'email', placeholder: 'Email address' },
  {
    icon: MessageSquare,
    label: 'WhatsApp',
    whcihfield: 'whatsapp',
    placeholder: 'WhatsApp number',
  },
  { icon: MapPin, label: 'Physical Address', whcihfield: 'address', placeholder: 'Store address' },
];

interface Props {
  onSelect: (content: string) => void;
  activeTab: string;
  product: any;
}

export default function CustomInstructionsManager({ onSelect, activeTab, product }: Props) {
  const {
    instructions,
    createInstruction,
    updateInstruction,
    deleteInstruction,
    setDefaultInstruction,
  } = useCustomInstructionsStore();
  const { user } = useProductStore();
  const { showStore, setShowStore } = useShowStore();
  const [showForm, setShowForm] = useState(false);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStore, setEditingStore] = useState<StoreType | null>(null);
  const [isEditingStore, setIsEditingStore] = useState(false);

  const [formData, setFormData] = useState<CreateInstructionDto>({
    name: '',
    content: '',
    tabId: activeTab,
    isDefault: false,
  });

  // Save stores to localStorage whenever they change
  React.useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const data = await getStoresByUserId(user.uid);
        setShowStore(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStoreDetails();
  }, [stores]);
  const getMatchedStore = showStore?.find(store => store?.id === product?.store);
  const [updateData, updateDataValues] = useState({
    id: getMatchedStore?.id || '',
    name: getMatchedStore?.name || '',
    storeLink: getMatchedStore?.storeLink || '',
    phone: getMatchedStore?.phone || '',
    email: getMatchedStore?.email || '',
    whatsapp: getMatchedStore?.whatsapp || '',
    productPageLink: getMatchedStore?.productPageLink || '',
    instagram: getMatchedStore?.instagram || '',
    snapchat: getMatchedStore?.snapchat || '',
    facebook: getMatchedStore?.facebook || '',
    youtube: getMatchedStore?.youtube || '',
    twitter: getMatchedStore?.twitter || '',
    address: getMatchedStore?.address || '',
  });

  // Handle change for individual fields
  const handleFieldChange = (fieldName, value) => {
    updateDataValues(prevState => ({
      ...prevState,
      [fieldName]: value,
    }));
  };
  // Filter instructions for current tab
  const tabInstructions = React.useMemo(
    () => instructions.filter(instruction => instruction.tabId === activeTab),
    [instructions, activeTab]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      updateInstruction(editingId, formData);
    } else {
      createInstruction({ ...formData, tabId: activeTab });
    }

    setFormData({ name: '', content: '', tabId: activeTab, isDefault: false });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    const instruction = instructions.find(i => i.id === id);
    if (!instruction) return;

    setFormData({
      tabId: instruction.tabId,
      name: instruction.name,
      content: instruction.content,
      isDefault: instruction.isDefault,
    });
    setEditingId(id);
    setShowForm(true);
  };
  const handleSave = async store => {
    try {
      if (updateData) {
        const updated = await updateTextEdit(updateData.id, updateData);
        const updatedData = showStore.map(s =>
          s.id === updateData.id ? { ...store, id: updateData.id } : s
        );
        setShowStore(updatedData);
        setIsEditingStore(false);
      }
    } catch (error) {
      setIsEditingStore(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Store Information Shortcuts */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Store className="w-4 h-4" />
            Store Information Shortcuts
          </h3>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                // Open My Stores modal
                const storesModal = document.querySelector('[data-modal="stores"]');
                if (storesModal instanceof HTMLElement) {
                  storesModal.click();
                }
              }}
              className="p-1.5 text-gray-500 hover:text-[#5D1C83] hover:bg-white rounded-lg transition-all group flex items-center gap-2"
              title="Manage Stores"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Manage Stores</span>
            </button>
            {isEditingStore ? (
              <button
                onClick={handleSave}
                className="p-1.5 text-gray-500 hover:text-[#5D1C83] hover:bg-white rounded-lg transition-all group flex items-center gap-2"
                title="Manage Stores"
              >
                <SaveAllIcon className="w-4 h-4" />
                <span className="text-sm">Save Store</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditingStore(true)}
                className="p-1.5 text-gray-500 hover:text-[#5D1C83] hover:bg-white rounded-lg transition-all group flex items-center gap-2"
                title="Manage Stores"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm">Edit Store</span>
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* {STORE_INFO_SHORTCUTS.map(({ icon: Icon, label, placeholder }) => (
            <button
              key={label}
              onClick={() => {
                const template = `${label}: {{${label.toLowerCase().replace(/\s+/g, '_')}}}`;
                if (formData.content) {
                  setFormData(prev => ({
                    ...prev,
                    content: prev.content + '\n' + template,
                  }));
                } else {
                  setFormData(prev => ({
                    ...prev,
                    content: template,
                  }));
                }
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-all hover:shadow-sm hover:text-[#5D1C83] group"
            >
              <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#5D1C83]" />
              <span>{label}</span>
            </button>
          ))} */}
          {STORE_INFO_SHORTCUTS.map(({ icon: Icon, label, placeholder, whcihfield }) => {
            const fieldName = label.toLowerCase().replace(/\s+/g, '_'); // Convert label to key (e.g., "Store Name" -> "store_name")

            return (
              <div key={label} className="flex flex-col">
                {isEditingStore ? (
                  <div>
                    <label htmlFor={whcihfield} className="text-sm text-gray-700">
                      {label}
                    </label>
                    <div className="flex items-center border rounded-md mt-1">
                      <Icon className="w-5 h-5 text-gray-400 p-2" />
                      <input
                        disabled={!isEditingStore}
                        id={whcihfield}
                        type="text"
                        value={updateData[whcihfield] || ''}
                        onChange={e => handleFieldChange(whcihfield, e.target.value)} // Update state on change
                        placeholder={placeholder}
                        className="px-3 py-2 text-sm text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-[#5D1C83]"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label htmlFor={whcihfield} className="text-sm text-gray-700 mr-2 font-bold">
                      {label}
                    </label>
                    <button
                      onClick={() => {
                        onSelect(updateData[whcihfield]);
                      }}
                      className="break-words text-sm"
                    >
                      {updateData[whcihfield]}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-[#5D1C83] text-white rounded-lg hover:bg-[#6D2C93] transition-all"
      >
        <Plus className="w-4 h-4" />
        Add New Custom Instruction
      </button>

      {showForm && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              onKeyDown={e => e.stopPropagation()}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={formData.content}
              onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
              onKeyDown={e => e.stopPropagation()}
              className="w-full h-32 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] resize-none"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onKeyDown={e => e.stopPropagation()}
              onChange={e => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
              className="rounded border-gray-300 text-[#5D1C83] focus:ring-[#5D1C83]"
            />
            <label htmlFor="isDefault" className="ml-2 text-sm text-gray-600">
              Set as default instruction
            </label>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onKeyDown={e => e.stopPropagation()}
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: '', content: '', isDefault: false, tabId: activeTab });
                // previous after removing errors
                // setFormData({ name: '', content: '', isDefault: false });
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              onKeyDown={e => e.stopPropagation()}
              className="px-4 py-2 text-sm bg-[#5D1C83] text-white rounded-lg hover:bg-[#6D2C93]"
            >
              {editingId ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Saved Instructions</h3>
        {tabInstructions.map(instruction => (
          <div
            key={instruction.id}
            className="p-3 bg-white rounded-lg border border-gray-200 hover:border-[#5D1C83]/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">{instruction.name}</h4>
                {instruction.isDefault && (
                  <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onSelect(instruction.content)}
                  className="p-1.5 text-gray-500 hover:text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-all"
                  title="Use this instruction"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDefaultInstruction(instruction.id)}
                  className="p-1.5 text-gray-500 hover:text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-all"
                  title={instruction.isDefault ? 'Remove default' : 'Set as default'}
                >
                  {instruction.isDefault ? (
                    <StarOff className="w-4 h-4" />
                  ) : (
                    <Star className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleEdit(instruction.id)}
                  className="p-1.5 text-gray-500 hover:text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-all"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteInstruction(instruction.id)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{instruction.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
