import React, { useState, useEffect } from 'react';
import { Star, Info, AlertCircle, Edit2, Save, X, RotateCcw } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';
import { AIDA_QUESTIONS, AIDA_WEIGHTS } from './constants';
import { RatingAnswers } from '../../types';

interface AidaTabProps {
  onScoreUpdate: (score: number, answers: RatingAnswers) => void;
  initialAnswers?: RatingAnswers;
}

export function AidaTab({ onScoreUpdate, initialAnswers = {} }: AidaTabProps) {
  const [answers, setAnswers] = useState<RatingAnswers>(initialAnswers);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['attention']));
  const [sectionWeights, setSectionWeights] = useState(AIDA_WEIGHTS);
  const [questions, setQuestions] = useState(AIDA_QUESTIONS);
  const [editingWeights, setEditingWeights] = useState(false);

  const resetToDefaults = () => {
    setAnswers({});
    setSectionWeights(AIDA_WEIGHTS);
    setQuestions(AIDA_QUESTIONS);
    setEditingWeights(false);
  };

  const calculateSectionScore = (section: string) => {
    const sectionQuestions = questions[section as keyof typeof questions];
    let sectionScore = 0;
    let maxSectionScore = 0;

    sectionQuestions.forEach(question => {
      const answer = answers[question.id] || 0;
      sectionScore += answer * question.weight;
      maxSectionScore += 10 * question.weight;
    });

    return {
      score: sectionScore,
      maxScore: maxSectionScore,
      percentage: maxSectionScore > 0 ? (sectionScore / maxSectionScore) * 100 : 0,
    };
  };

  const calculateTotalScore = () => {
    let weightedScore = 0;

    Object.entries(sectionWeights).forEach(([section, weight]) => {
      const { score, maxScore } = calculateSectionScore(section);
      weightedScore += (score / maxScore) * weight * 100;
    });

    return Math.round(weightedScore);
  };

  useEffect(() => {
    const totalScore = calculateTotalScore();
    onScoreUpdate(totalScore, answers);
  }, [answers, sectionWeights, questions]);

  const getScoreCategory = (score: number) => {
    if (score >= 80) return { text: 'Excellent', color: 'text-green-600' };
    if (score >= 60) return { text: 'Good', color: 'text-blue-600' };
    if (score >= 40) return { text: 'Fair', color: 'text-yellow-600' };
    return { text: 'Poor', color: 'text-red-600' };
  };

  const totalScore = calculateTotalScore();
  const scoreCategory = getScoreCategory(totalScore);

  return (
    <div className="space-y-6">
      {/* Score Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-purple-900">AIDA Analysis Score</h3>
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset All
            </button>
          </div>
          <div className="text-3xl font-bold text-purple-600">{totalScore}/100</div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* English Score Info */}
          <div>
            <div className={`text-lg font-medium ${scoreCategory.color}`}>
              {scoreCategory.text} Marketing Potential
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {totalScore >= 80 && 'Very well positioned product/campaign with strong potential.'}
              {totalScore >= 60 && totalScore < 80 && 'Good potential but needs some adjustments.'}
              {totalScore >= 40 && totalScore < 60 && 'Significant improvements needed.'}
              {totalScore < 40 && 'Major revision of strategy/concept recommended.'}
            </div>
          </div>

          {/* Arabic Score Info */}
          <div className="text-right" dir="rtl">
            <div className={`text-lg font-medium ${scoreCategory.color}`}>
              {totalScore >= 80 && 'إمكانات تسويقية ممتازة'}
              {totalScore >= 60 && totalScore < 80 && 'إمكانات تسويقية جيدة'}
              {totalScore >= 40 && totalScore < 60 && 'يحتاج إلى تحسينات'}
              {totalScore < 40 && 'يحتاج إلى مراجعة شاملة'}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {totalScore >= 80 && 'منتج/حملة في وضع جيد جداً مع إمكانات قوية'}
              {totalScore >= 60 && totalScore < 80 && 'إمكانات جيدة لكن تحتاج لبعض التعديلات'}
              {totalScore >= 40 && totalScore < 60 && 'يحتاج إلى تحسينات مهمة'}
              {totalScore < 40 && 'يوصى بمراجعة شاملة للاستراتيجية/المفهوم'}
            </div>
          </div>
        </div>

        {/* Section Weights */}
        <div className="mt-6 pt-6 border-t border-purple-100 grid grid-cols-2 gap-6">
          <div className="space-y-3">
            {Object.entries(sectionWeights).map(([section, weight]) => (
              <div key={section} className="flex justify-between items-center">
                <span className="capitalize">{section}:</span>
                <span className="font-medium text-purple-600">{Math.round(weight * 100)}%</span>
              </div>
            ))}
          </div>
          <div className="space-y-3 text-right" dir="rtl">
            <div className="flex justify-between items-center">
              <span>الانتباه</span>
              <span className="font-medium text-purple-600" dir="ltr">
                25%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>الاهتمام</span>
              <span className="font-medium text-purple-600" dir="ltr">
                25%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>الرغبة</span>
              <span className="font-medium text-purple-600" dir="ltr">
                30%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>الإجراء</span>
              <span className="font-medium text-purple-600" dir="ltr">
                20%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AIDA Sections */}
      {Object.entries(questions).map(([section, sectionQuestions]) => {
        const { score, maxScore, percentage } = calculateSectionScore(section);
        const isExpanded = expandedSections.has(section);

        return (
          <div
            key={section}
            className={`bg-white rounded-xl border transition-all ${
              isExpanded ? 'border-purple-200 shadow-lg' : 'border-gray-200'
            }`}
          >
            {/* Section Header */}
            <button
              onClick={() =>
                setExpandedSections(prev => {
                  const newSet = new Set(prev);
                  if (newSet.has(section)) {
                    newSet.delete(section);
                  } else {
                    newSet.add(section);
                  }
                  return newSet;
                })
              }
              className="w-full px-6 py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold capitalize">{section}</h3>
                <div className="text-sm text-gray-500">({Math.round(percentage)}% complete)</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Score</div>
                  <div className="font-semibold text-purple-600">
                    {score.toFixed(1)}/{maxScore.toFixed(1)}
                  </div>
                </div>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </button>

            {/* Questions */}
            {isExpanded && (
              <div className="p-6 border-t border-gray-100 space-y-6">
                {sectionQuestions.map((question, index) => (
                  <React.Fragment key={question.id}>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-4">
                        {/* Question Header */}
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{question.en}</div>
                            <div className="text-right text-gray-600" dir="rtl">
                              {question.ar}
                            </div>
                          </div>
                          <Tooltip content={`Weight: ${Math.round(question.weight * 100)}%`}>
                            <div className="flex items-center gap-1 text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded">
                              {Math.round(question.weight * 100)}%
                            </div>
                          </Tooltip>
                        </div>

                        {/* Question Info */}
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm" dir="rtl">
                          {question.description && (
                            <div className="flex items-start gap-2">
                              <Info size={16} className="text-purple-500 mt-1 flex-shrink-0" />
                              <p className="text-gray-600">{question.description}</p>
                            </div>
                          )}
                          {question.importance && (
                            <div className="flex items-start gap-2">
                              <AlertCircle size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                              <p className="text-gray-600">{question.importance}</p>
                            </div>
                          )}
                        </div>

                        {/* Rating Stars */}
                        <div className="flex justify-center gap-2">
                          {[2, 4, 6, 8, 10].map(score => (
                            <button
                              key={score}
                              onClick={() =>
                                setAnswers(prev => ({
                                  ...prev,
                                  [question.id]: score,
                                }))
                              }
                              className={`p-2 rounded-lg transition-colors ${
                                answers[question.id] === score
                                  ? 'bg-purple-100 text-purple-600'
                                  : 'hover:bg-gray-100 text-gray-400'
                              }`}
                            >
                              <Star
                                size={24}
                                className={answers[question.id] >= score ? 'fill-current' : ''}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Add separator between questions except for the last one */}
                    {index < sectionQuestions.length - 1 && (
                      <div className="border-b border-gray-200" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
