import React, { useState, useEffect } from 'react';
import { Star, Info, AlertCircle } from 'lucide-react';
import { RatingAnswers } from '../../types';

interface SwotTabProps {
  onScoreUpdate: (score: number, answers: RatingAnswers) => void;
  initialAnswers?: RatingAnswers;
}

// Scoring weights for each section
const SECTION_WEIGHTS = {
  strengths: 0.35, // 35% of total score
  weaknesses: 0.25, // 25% of total score
  opportunities: 0.3, // 30% of total score
  threats: 0.1, // 10% of total score
};

// SWOT Questions configuration
const SWOT_QUESTIONS = {
  strengths: [
    {
      id: 'uniqueness',
      en: 'Is the product unique compared to competitors?',
      ar: 'هل المنتج فريد مقارنة بالمنافسين؟',
      description: 'هل يتميز المنتج بخصائص فريدة تميزه عن المنافسين؟',
      importance: 'التميز يمنح المنتج ميزة تنافسية في السوق.',
      weight: 0.25,
    },
    {
      id: 'profitMargin',
      en: 'Does the product have a high profit margin?',
      ar: 'هل هامش الربح للمنتج مرتفع؟',
      description: 'هل يحقق المنتج هامش ربح جيد مقارنة بتكلفته؟',
      importance: 'هامش الربح المرتفع يضمن استدامة المشروع.',
      weight: 0.25,
    },
    {
      id: 'problemSolving',
      en: 'Does the product solve a specific problem?',
      ar: 'هل يحل المنتج مشكلة محددة؟',
      description: 'هل يقدم المنتج حلاً واضحاً لمشكلة يواجهها العملاء؟',
      importance: 'المنتجات التي تحل مشاكل حقيقية تلقى قبولاً أكبر.',
      weight: 0.25,
    },
    {
      id: 'engagement',
      en: 'Does the product generate strong customer engagement?',
      ar: 'هل يجذب المنتج تفاعلًا قويًا من العملاء؟',
      description: 'هل يحصل المنتج على تفاعل وتعليقات ومشاركات من العملاء؟',
      importance: 'التفاعل القوي يدل على اهتمام حقيقي بالمنتج.',
      weight: 0.25,
    },
  ],
  weaknesses: [
    {
      id: 'customerAcquisition',
      en: 'Is customer acquisition cost low?',
      ar: 'هل تكلفة الحصول على العملاء منخفضة؟',
      description: 'هل تكلفة جذب عملاء جدد منخفضة؟',
      importance: 'انخفاض تكلفة اكتساب العملاء يزيد من الربحية.',
      weight: 0.35,
    },
    {
      id: 'durability',
      en: 'Is the product durable and not fragile?',
      ar: 'هل المنتج متين وغير قابل للكسر؟',
      description: 'هل المنتج قوي ويتحمل الاستخدام والشحن؟',
      importance: 'متانة المنتج تقلل من المرتجعات والشكاوى.',
      weight: 0.35,
    },
    {
      id: 'valueForMoney',
      en: 'Does the price reflect good value for quality?',
      ar: 'هل السعر يعكس قيمة جيدة مقابل الجودة؟',
      description: 'هل يشعر العملاء أن سعر المنتج يناسب جودته؟',
      importance: 'التوازن بين السعر والجودة يؤثر على قرار الشراء.',
      weight: 0.3,
    },
  ],
  opportunities: [
    {
      id: 'growth',
      en: 'Is demand for the product growing?',
      ar: 'هل الطلب على المنتج في نمو؟',
      description: 'هل هناك زيادة في الطلب على المنتج في السوق؟',
      importance: 'نمو الطلب يشير إلى فرص مستقبلية.',
      weight: 0.35,
    },
    {
      id: 'viral',
      en: 'Does the product have viral potential?',
      ar: 'هل للمنتج إمكانية الانتشار الفيروسي؟',
      description: 'هل يمكن للمنتج أن ينتشر بسرعة عبر وسائل التواصل؟',
      importance: 'الانتشار الفيروسي يقلل تكاليف التسويق.',
      weight: 0.35,
    },
    {
      id: 'seasonality',
      en: 'Is this the right season for the product?',
      ar: 'هل هذا هو الموسم المناسب للمنتج؟',
      description: 'هل توقيت طرح المنتج مناسب موسمياً؟',
      importance: 'التوقيت المناسب يزيد من فرص النجاح.',
      weight: 0.3,
    },
  ],
  threats: [
    {
      id: 'competition',
      en: 'Is there limited competition?',
      ar: 'هل المنافسة محدودة؟',
      description: 'هل عدد المنافسين في السوق قليل؟',
      importance: 'المنافسة المحدودة تزيد من فرص النجاح.',
      weight: 0.35,
    },
    {
      id: 'reviews',
      en: 'Are customer reviews consistently positive?',
      ar: 'هل تقييمات العملاء إيجابية باستمرار؟',
      description: 'هل آراء العملاء وتقييماتهم إيجابية؟',
      importance: 'التقييمات الإيجابية تؤثر على قرارات الشراء.',
      weight: 0.35,
    },
    {
      id: 'priceThreat',
      en: 'Is there a risk of competitors lowering prices?',
      ar: 'هل هناك خطر من تخفيض المنافسين للأسعار؟',
      description: 'هل هناك احتمال لحرب أسعار مع المنافسين؟',
      importance: 'تخفيض الأسعار من المنافسين يؤثر على الربحية.',
      weight: 0.3,
    },
  ],
};

export function SwotTab({ onScoreUpdate, initialAnswers = {} }: SwotTabProps) {
  const [answers, setAnswers] = useState<RatingAnswers>(initialAnswers);

  const calculateSectionScore = (section: string) => {
    const sectionQuestions = SWOT_QUESTIONS[section as keyof typeof SWOT_QUESTIONS];
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

    Object.entries(SECTION_WEIGHTS).forEach(([section, weight]) => {
      const { score, maxScore } = calculateSectionScore(section);
      weightedScore += (score / maxScore) * weight * 100;
    });

    return Math.round(weightedScore);
  };

  useEffect(() => {
    const totalScore = calculateTotalScore();
    onScoreUpdate(totalScore, answers);
  }, [answers]);

  return (
    <div className="space-y-6 h-[70vh] overflow-y-auto">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
        <h3 className="text-xl font-semibold text-purple-900 mb-4">Scoring Method</h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-purple-800 mb-2">Weights & Scoring</h4>
            <div className="space-y-2 text-sm">
              <p>Strengths: 35% (35 points max)</p>
              <p>Weaknesses: 25% (25 points max)</p>
              <p>Opportunities: 30% (30 points max)</p>
              <p>Threats: 10% (10 points max)</p>
            </div>
          </div>

          <div className="text-right" dir="rtl">
            <h4 className="font-medium text-purple-800 mb-2">الأوزان والتقييم</h4>
            <div className="space-y-2 text-sm">
              <p>نقاط القوة: 35% (35 نقطة كحد أقصى)</p>
              <p>نقاط الضعف: 25% (25 نقطة كحد أقصى)</p>
              <p>الفرص: 30% (30 نقطة كحد أقصى)</p>
              <p>التهديدات: 10% (10 نقاط كحد أقصى)</p>
            </div>
          </div>
        </div>

        {/* Total Score Display */}
        <div className="mt-6 pt-6 border-t border-purple-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star size={24} className="text-yellow-500" />
              <span className="text-lg font-semibold">Total Score:</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{calculateTotalScore()}/100</div>
          </div>
        </div>
      </div>

      {/* SWOT Sections */}
      {Object.entries(SWOT_QUESTIONS).map(([section, questions]) => {
        const { score, maxScore, percentage } = calculateSectionScore(section);

        return (
          <div key={section} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold capitalize text-gray-900">{section}</h3>
              <div className="text-sm">
                <span className="font-medium text-purple-600">{Math.round(percentage)}%</span>
                <span className="text-gray-500 ml-2">
                  ({score.toFixed(1)}/{maxScore.toFixed(1)} points)
                </span>
              </div>
            </div>

            <div className="space-y-8">
              {questions.map(question => (
                <div key={question.id} className="space-y-4">
                  <div className="flex flex-col gap-4">
                    {/* Question Header */}
                    <div className="space-y-2">
                      <div className="font-medium text-gray-900">{question.en}</div>
                      <div className="text-right text-gray-600" dir="rtl">
                        {question.ar}
                      </div>
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
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
