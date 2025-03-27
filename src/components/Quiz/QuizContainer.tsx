import React, { useState, useEffect } from 'react';
import { QuizQuestion } from './QuizQuestion';
import { QuizProgress } from './QuizProgress';
import { useRatingStore } from '../../store/ratingStore';

interface QuizContainerProps {
  productId: string;
  onClose: () => void;
  onComplete: (rating: number) => void;
}

const questions = [
  {
    id: 'problem',
    en: 'Does the product solve a clear problem?',
    ar: 'هل يحل المنتج مشكلة واضحة؟'
  },
  {
    id: 'value',
    en: 'Does it have high perceived value?',
    ar: 'هل له قيمة مدركة عالية؟'
  },
  {
    id: 'reviews',
    en: 'Are there positive customer reviews?',
    ar: 'هل هناك تقييمات إيجابية من العملاء؟'
  },
  {
    id: 'selling',
    en: 'Is it currently selling well?',
    ar: 'هل يباع حاليا بشكل جيد؟'
  },
  {
    id: 'variants',
    en: 'Does it have minimal variants/options?',
    ar: 'هل لديه خيارات/متغيرات محدودة؟'
  },
  {
    id: 'videos',
    en: 'Are there product/problem demonstration videos?',
    ar: 'هل هناك مقاطع فيديو توضح المنتج/المشكلة؟'
  },
  {
    id: 'simulator',
    en: 'Is there a product simulator or demo available?',
    ar: 'هل يتوفر محاكي أو عرض توضيحي للمنتج؟'
  },
  {
    id: 'testing',
    en: 'Has the product been tested in the market?',
    ar: 'هل تم اختبار المنتج في السوق؟'
  },
  {
    id: 'competition',
    en: 'Is there limited competition?',
    ar: 'هل المنافسة محدودة؟'
  },
  {
    id: 'margin',
    en: 'Does it have good profit margins?',
    ar: 'هل لديه هوامش ربح جيدة؟'
  }
];

export function QuizContainer({ productId, onClose, onComplete }: QuizContainerProps) {
  const { getProductRatingAnswers, updateProductRatingAnswers } = useRatingStore();
  const [answers, setAnswers] = useState<Record<string, number>>(
    getProductRatingAnswers(productId) || {}
  );

  const handleScore = (questionId: string, score: number) => {
    const newAnswers = { ...answers, [questionId]: score };
    setAnswers(newAnswers);
    
    // If all questions are answered, update the rating
    if (Object.keys(newAnswers).length === questions.length) {
      const rating = updateProductRatingAnswers(productId, newAnswers);
      onComplete(rating);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const averageScore = answeredCount > 0
    ? Object.values(answers).reduce((sum, score) => sum + score, 0) / answeredCount
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl w-full max-w-4xl shadow-xl">
        <div className="p-6 space-y-6">
          <QuizProgress
            totalQuestions={questions.length}
            answeredQuestions={answeredCount}
            averageScore={averageScore}
          />

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {questions.map((question) => (
              <QuizQuestion
                key={question.id}
                id={question.id}
                englishText={question.en}
                arabicText={question.ar}
                score={answers[question.id] || 0}
                onScore={(score) => handleScore(question.id, score)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}