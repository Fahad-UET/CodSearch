import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2, Eye, EyeOff, Edit2, Check, AlertCircle } from 'lucide-react';
import { useProductStore } from '../store';
import { ChargeCategory, ChargeSubcategory } from '../types';

interface CategoryManagerProps {
  onClose: () => void;
}

export function CategoryManager({ onClose }: CategoryManagerProps) {
  const {
    loadCategories,
    chargeCategories,
    updateCategory,
    deleteCategory,
    updateSubcategory,
    deleteSubcategory,
    initializeDefaultCategories,
    addCategory,
    addSubcategory,
  } = useProductStore();

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<{
    categoryId: string;
    subcategoryId: string;
  } | null>(null);
  const [editedName, setEditedName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: 'category' | 'subcategory';
    id: string;
    parentId?: string;
  } | null>(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showNewSubcategory, setShowNewSubcategory] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadCategories();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load data');
      }
    };

    loadData();
  }, [loadCategories, initializeDefaultCategories]);

  const handleResetToDefaults = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await initializeDefaultCategories();
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset categories');
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newItemName.trim()) return;

    try {
      await addCategory({ label: newItemName.trim() });
      setNewItemName('');
      setShowNewCategory(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category');
    }
  };

  const handleAddSubcategory = async (categoryId: string) => {
    if (!newItemName.trim()) return;

    try {
      await addSubcategory(categoryId, { label: newItemName.trim() });
      setNewItemName('');
      setShowNewSubcategory(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add subcategory');
    }
  };
  const handleToggleCategory = async (category: ChargeCategory) => {
    try {
      await updateCategory(category.id, {
        isActive: !category.isActive,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle category');
    }
  };

  const handleToggleSubcategory = async (categoryId: string, subcategory: ChargeSubcategory) => {
    try {
      await updateSubcategory(categoryId, subcategory.id, {
        isActive: !subcategory.isActive,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle subcategory');
    }
  };

  const handleEditCategory = (category: ChargeCategory) => {
    setEditingCategory(category.id);
    setEditedName(category.label);
  };

  const handleEditSubcategory = (categoryId: string, subcategory: ChargeSubcategory) => {
    setEditingSubcategory({ categoryId, subcategoryId: subcategory.id });
    setEditedName(subcategory.label);
  };

  const handleSaveCategory = async (categoryId: string) => {
    if (!editedName.trim()) return;

    try {
      await updateCategory(categoryId, { label: editedName.trim() });
      setEditingCategory(null);
      setEditedName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
    }
  };

  const handleSaveSubcategory = async (categoryId: string, subcategoryId: string) => {
    if (!editedName.trim()) return;

    try {
      await updateSubcategory(categoryId, subcategoryId, { label: editedName.trim() });
      setEditingSubcategory(null);
      setEditedName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subcategory');
    }
  };

  const handleConfirmDelete = async () => {
    if (!showDeleteConfirm) return;

    try {
      if (showDeleteConfirm.type === 'category') {
        await deleteCategory(showDeleteConfirm.id);
      } else {
        if (!showDeleteConfirm.parentId) return;
        await deleteSubcategory(showDeleteConfirm.parentId, showDeleteConfirm.id);
      }
      setShowDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to delete ${showDeleteConfirm.type}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Manage Categories</h2>
            <p className="text-sm text-gray-500 mt-1">
              Edit, activate, or remove charge categories
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetToDefaults}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
            >
              Reset to Defaults
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-73px)]">
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {/* Add New Category Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowNewCategory(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Add Category
              </button>
            </div>

            {/* New Category Form */}
            {showNewCategory && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                    placeholder="Enter category name"
                    className="flex-1 rounded-lg border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200"
                    autoFocus
                  />
                  <button
                    onClick={handleAddCategory}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewItemName('');
                    }}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Categories List */}
            <div className="space-y-4">
              {chargeCategories.map(category => (
                <div key={category.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50 flex items-center justify-between">
                    {editingCategory === category.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editedName}
                          onChange={e => setEditedName(e.target.value)}
                          className="flex-1 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                          placeholder="Category name"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveCategory(category.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCategory(null);
                            setEditedName('');
                          }}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-lg font-medium text-gray-900">{category.label}</h3>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowNewSubcategory(category.id)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Add subcategory"
                      >
                        <Plus size={20} />
                      </button>
                      <button
                        onClick={() => handleToggleCategory(category)}
                        className={`p-2 rounded-lg transition-colors ${
                          category.isActive
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {category.isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm({ type: 'category', id: category.id })}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* New Subcategory Form */}
                  {showNewSubcategory === category.id && (
                    <div className="p-4 bg-purple-50">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newItemName}
                          onChange={e => setNewItemName(e.target.value)}
                          placeholder="Enter subcategory name"
                          className="flex-1 rounded-lg border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200"
                          autoFocus
                        />
                        <button
                          onClick={() => handleAddSubcategory(category.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setShowNewSubcategory(null);
                            setNewItemName('');
                          }}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="p-4 space-y-3">
                    {category.subcategories?.map(subcategory => (
                      <div
                        key={subcategory.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        {editingSubcategory?.subcategoryId === subcategory.id ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={editedName}
                              onChange={e => setEditedName(e.target.value)}
                              className="flex-1 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                              placeholder="Subcategory name"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveSubcategory(category.id, subcategory.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingSubcategory(null);
                                setEditedName('');
                              }}
                              className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-700">{subcategory.label}</span>
                        )}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleSubcategory(category.id, subcategory)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              subcategory.isActive
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                            {subcategory.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button
                            onClick={() => handleEditSubcategory(category.id, subcategory)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() =>
                              setShowDeleteConfirm({
                                type: 'subcategory',
                                id: subcategory.id,
                                parentId: category.id,
                              })
                            }
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[80]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete {showDeleteConfirm.type === 'category' ? 'Category' : 'Subcategory'}?
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  This action cannot be undone. All associated charges will be deleted as well.
                </p>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
