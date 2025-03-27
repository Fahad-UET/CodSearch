import React, { useState } from 'react';
import { MindMapIcon } from './MindMapIcon';
import { useMindMapStore } from '../../store/mindMapStore';
import { AddNodeModal } from './AddNodeModal';

interface MindMapToolbarProps {
  onClose: () => void;
}

export function MindMapToolbar({ onClose }: MindMapToolbarProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const { addNode, selectedNodeId } = useMindMapStore();

  const handleAddNode = (label: string) => {
    addNode(selectedNodeId, label);
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-white/50 backdrop-blur-sm border-b border-purple-100">
      <button
        onClick={() => setShowAddModal(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
      >
        <MindMapIcon type="network" size={18} />
        Add Node
      </button>
      
      {showAddModal && (
        <AddNodeModal
          onAdd={handleAddNode}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}