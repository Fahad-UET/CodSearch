import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MindMapNode } from '../../types/mindMap';
import { useMindMapStore } from '../../store/mindMapStore';
import { COLORS } from './constants';
import { Node } from './Node';
import { AddNodeModal } from './AddNodeModal';

export function MindMap() {
  const { nodes, selectedNodeId, setSelectedNode, updateNodePosition, addNode, addLink } = useMindMapStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isLinking, setIsLinking] = useState(false);
  const [linkStart, setLinkStart] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addNodePosition, setAddNodePosition] = useState<{ x: number; y: number; parentId: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    
    if (e.button === 2) { // Right click for linking
      e.preventDefault();
      setIsLinking(true);
      setLinkStart(nodeId);
      return;
    }

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setIsDragging(true);
    setSelectedNode(nodeId);
    setDragOffset({
      x: e.clientX - (node.x || 0),
      y: e.clientY - (node.y || 0)
    });
  }, [nodes, setSelectedNode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging && !isLinking) return;

    if (isDragging && selectedNodeId) {
      updateNodePosition(selectedNodeId, {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  }, [isDragging, isLinking, selectedNodeId, dragOffset, updateNodePosition]);

  const handleMouseUp = useCallback((e: React.MouseEvent, nodeId?: string) => {
    if (isLinking && linkStart && nodeId && linkStart !== nodeId) {
      addLink(linkStart, nodeId);
    }
    setIsDragging(false);
    setIsLinking(false);
    setLinkStart(null);
  }, [isLinking, linkStart, addLink]);

  const handleAddChild = useCallback((parentId: string, position: { x: number; y: number }) => {
    setAddNodePosition({ ...position, parentId });
    setShowAddModal(true);
  }, []);

  const renderNode = useCallback((node: MindMapNode, level: number = 0) => {
    return (
      <React.Fragment key={node.id}>
        {/* Node links */}
        {node.children?.map(child => {
          const childNode = nodes.find(n => n.id === child.id);
          if (!childNode) return null;

          return (
            <motion.path
              key={`${node.id}-${child.id}`}
              d={`M ${node.x} ${node.y} Q ${(node.x + childNode.x!) / 2} ${(node.y + childNode.y!) / 2} ${childNode.x} ${childNode.y}`}
              stroke="url(#line-gradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
        
        <Node
          node={node}
          level={level}
          isSelected={selectedNodeId === node.id}
          onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
          onMouseUp={(e) => handleMouseUp(e, node.id)}
          onAddChild={(position) => handleAddChild(node.id, position)}
        />

        {node.children?.map(child => {
          const childNode = nodes.find(n => n.id === child.id);
          if (!childNode) return null;
          return renderNode(childNode, level + 1);
        })}
      </React.Fragment>
    );
  }, [nodes, selectedNodeId, handleNodeMouseDown, handleMouseUp, handleAddChild]);

  return (
    <div className="w-full h-full overflow-hidden bg-gradient-to-br from-gray-50 to-purple-50">
      <svg 
        ref={svgRef}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseUp={(e) => handleMouseUp(e)}
        onContextMenu={(e) => e.preventDefault()}
      >
        <defs>
          {COLORS.map((color, i) => (
            <linearGradient key={i} id={`gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={`text-${color.split('-')[2]}-500`} stopColor="currentColor" />
              <stop offset="100%" className={`text-${color.split('-')[4]}-500`} stopColor="currentColor" />
            </linearGradient>
          ))}
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {nodes.map(node => renderNode(node))}

        {/* Linking line preview */}
        {isLinking && linkStart && (
          <line
            x1={nodes.find(n => n.id === linkStart)?.x || 0}
            y1={nodes.find(n => n.id === linkStart)?.y || 0}
            x2={dragOffset.x}
            y2={dragOffset.y}
            stroke="url(#line-gradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="opacity-50"
          />
        )}
      </svg>
      
      {showAddModal && addNodePosition && (
        <AddNodeModal
          onAdd={(label) => {
            addNode(addNodePosition.parentId, label);
            setShowAddModal(false);
            setAddNodePosition(null);
          }}
          onClose={() => {
            setShowAddModal(false);
            setAddNodePosition(null);
          }}
        />
      )}
    </div>
  );
}