import React from 'react';
import { MindMap } from './index';
import { MindMapNode } from './types';

const exampleData: MindMapNode = {
  id: 'root',
  label: 'Product Strategy',
  children: [
    {
      id: 'planning',
      label: 'Planning Process',
      children: [
        { id: 'planning-1', label: 'Initial Planning' },
        { id: 'planning-2', label: 'Centralized Process' },
        { id: 'planning-3', label: 'Strategy Definition' }
      ]
    },
    {
      id: 'management',
      label: 'Product Management',
      children: [
        { id: 'management-1', label: 'Feature Prioritization' },
        { id: 'management-2', label: 'Roadmap Planning' },
        { id: 'management-3', label: 'Release Management' }
      ]
    },
    {
      id: 'metrics',
      label: 'Key Metrics',
      children: [
        { id: 'metrics-1', label: 'User Growth' },
        { id: 'metrics-2', label: 'Engagement' },
        { id: 'metrics-3', label: 'Revenue' }
      ]
    },
    {
      id: 'team',
      label: 'Team Structure',
      children: [
        { id: 'team-1', label: 'Product Teams' },
        { id: 'team-2', label: 'Engineering' },
        { id: 'team-3', label: 'Design' }
      ]
    }
  ]
};

export function MindMapExample() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <MindMap />
      {/* // to resolve build issue please check this  */}
      {/* <MindMap data={exampleData} /> */}
    </div>
  );
}