import React from 'react';
import { CheckCircle } from 'lucide-react';

interface QuizProgressProps {
  totalQuestions: number;
  answeredQuestions: number;
  averageScore: number;
}

export function QuizProgress({ totalQuestions, answeredQuestions, averageScore }: QuizProgressProps) {
  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CheckCircle size={20} className="text-purple-600" />
          <span className="font-medium text-gray-900">Progress</span>
        </div>
        <span className="text-sm text-gray-600">
          {answeredQuestions} of {totalQuestions} questions answered
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-purple-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Average Score */}
      {answeredQuestions > 0 && (
        <div className="mt-2 text-right">
          <span className="text-sm text-gray-600">Average Score: </span>
          <span className="font-medium text-purple-600">
            {averageScore.toFixed(1)}/10
          </span>
        </div>
      )}
    </div>
  );
}