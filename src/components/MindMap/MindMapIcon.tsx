import React from 'react';
import { BrainCircuit, Network, GitBranch, Share2, Workflow } from 'lucide-react';

interface MindMapIconProps {
  type?: 'brain' | 'network' | 'branch' | 'share' | 'workflow';
  size?: number;
  className?: string;
}

export function MindMapIcon({ type = 'brain', size = 24, className = '' }: MindMapIconProps) {
  const icons = {
    brain: BrainCircuit,
    network: Network,
    branch: GitBranch,
    share: Share2,
    workflow: Workflow
  };

  const Icon = icons[type];
  return <Icon size={size} className={className} />;
}