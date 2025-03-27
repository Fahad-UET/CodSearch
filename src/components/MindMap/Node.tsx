import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { MindMapNode } from '../../types/mindMap';
import { COLORS, NODE_RADIUS, BUTTON_RADIUS, BUTTON_DISTANCE } from './constants';

interface NodeProps {
  node: MindMapNode;
  level: number;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onAddChild: (position: { x: number; y: number }) => void;
}

export function Node({
  node,
  level,
  isSelected,
  onMouseDown,
  onMouseUp,
  onAddChild
}: NodeProps) {
  const color = COLORS[level % COLORS.length];
  const { x = 0, y = 0 } = node;

  const handleAddChild = (angle: number) => {
    const radian = (angle * Math.PI) / 180;
    const dx = BUTTON_DISTANCE * Math.cos(radian);
    const dy = BUTTON_DISTANCE * Math.sin(radian);
    onAddChild({ x: x + dx, y: y + dy });
  };

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      className="cursor-grab active:cursor-grabbing"
    >
      {/* Node background */}
      <rect
        x={x - 80}
        y={y - 20}
        width="160"
        height="40"
        rx="20"
        className={`bg-gradient-to-r ${color} shadow-lg ${
          isSelected ? 'stroke-2 stroke-white' : ''
        }`}
        fill={`url(#gradient-${level % COLORS.length})`}
      />

      {/* Node text */}
      <text
        x={x}
        y={y + 6}
        textAnchor="middle"
        className="text-sm font-medium fill-white select-none"
      >
        {node.label}
      </text>

      {/* Add buttons */}
      {isSelected && (
        <g>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const radian = (angle * Math.PI) / 180;
            const buttonX = x + BUTTON_DISTANCE * Math.cos(radian);
            const buttonY = y + BUTTON_DISTANCE * Math.sin(radian);
            
            return (
              <motion.g
                key={angle}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                style={{ transformOrigin: `${buttonX}px ${buttonY}px` }}
              >
                <circle
                  cx={buttonX}
                  cy={buttonY}
                  r={BUTTON_RADIUS}
                  className="fill-purple-100 stroke-purple-400 cursor-pointer hover:fill-purple-200 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddChild(angle);
                  }}
                />
                <Plus
                  size={12}
                  className="text-purple-600 pointer-events-none"
                  style={{
                    transform: `translate(${buttonX - 6}px, ${buttonY - 6}px)`
                  }}
                />
              </motion.g>
            );
          })}
        </g>
      )}
    </motion.g>
  );
}