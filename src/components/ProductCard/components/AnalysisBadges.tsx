import React from 'react';
import { Target, BrainCircuit, AlertCircle } from 'lucide-react';

interface AnalysisBadgesProps {
  swotScore?: number;
  aidaScore?: number;
  swotAnalysis?: { updatedAt?: Date };
  aidaAnalysis?: { updatedAt?: Date };
}

export function AnalysisBadges({ 
  swotScore, 
  aidaScore,
  swotAnalysis,
  aidaAnalysis 
}: AnalysisBadgesProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'from-green-500/90 to-green-600/90';
    if (score >= 6) return 'from-blue-500/90 to-blue-600/90';
    if (score >= 4) return 'from-yellow-500/90 to-yellow-600/90';
    return 'from-red-500/90 to-red-600/90';
  };

  const getAnalysisStatus = (analysis?: { updatedAt?: Date }) => {
    if (!analysis) return 'pending';
    if (analysis.updatedAt) return 'completed';
    return 'pending';
  };

  const swotStatus = getAnalysisStatus(swotAnalysis);
  const aidaStatus = getAnalysisStatus(aidaAnalysis);

  return (
    <div className="absolute top-2 left-2 flex gap-2 z-30">
      {/* SWOT Badge */}
      <div className={`flex items-center gap-1.5 px-2 py-1 bg-gradient-to-br ${
        swotStatus === 'completed' 
          ? getScoreColor(swotScore || 0)
          : 'from-gray-500/90 to-gray-600/90'
      } backdrop-blur-sm text-white rounded-lg shadow-lg transform hover:scale-105 transition-transform`}>
        <Target size={14} className="text-white/80" />
        <span className="text-xs font-medium">
          SWOT: {swotStatus === 'completed' ? `${swotScore}/10` : 'Pending'}
        </span>
      </div>
      
      {/* AIDA Badge */}
      <div className={`flex items-center gap-1.5 px-2 py-1 bg-gradient-to-br ${
        aidaStatus === 'completed'
          ? getScoreColor(aidaScore || 0)
          : 'from-gray-500/90 to-gray-600/90'
      } backdrop-blur-sm text-white rounded-lg shadow-lg transform hover:scale-105 transition-transform`}>
        <BrainCircuit size={14} className="text-white/80" />
        <span className="text-xs font-medium">
          AIDA: {aidaStatus === 'completed' ? `${aidaScore}/10` : 'Pending'}
        </span>
      </div>
    </div>
  );
}