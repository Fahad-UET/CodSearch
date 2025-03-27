import React, { useState, useEffect } from 'react';
import { 
  X, Star, Save, AlertCircle, 
  HelpCircle, CheckCircle2, ShieldCheck, 
  TrendingUp, Layers, Video, Laptop,
  TestTube, Users, Image, Package
} from 'lucide-react';
import { RatingAnswers } from '../types';

interface Question {
  id: string;
  en: string;
  ar: string;
  description?: string;
  importance?: string;
  example?: string;
  icon: React.ReactNode;
}

interface RatingQuestionnaireProps {
  productId: string;
  initialAnswers: RatingAnswers;
  onClose: () => void;
  onSubmit: (answers: RatingAnswers) => void;
}

const questions: Question[] = [
  {
    id: 'problem',
    en: 'Solves a Problem?',
    ar: 'هل يحل مشكلة؟',
    description: 'هل المنتج يساهم في حل مشكلة معينة أو يلبي حاجة ضرورية؟',
    importance: 'المنتجات التي تحل مشاكل ملموسة تُباع بشكل أفضل لأنها تلامس احتياجات حقيقية لدى العملاء.',
    example: 'حامل مغناطيسي للهاتف في السيارة يحل مشكلة تثبيت الهاتف أثناء القيادة.',
    icon: <HelpCircle className="text-purple-500" />
  },
  {
    id: 'value',
    en: 'High Perceived Value?',
    ar: 'هل له قيمة عالية مدركة؟',
    description: 'هل يبدو المنتج ذو قيمة عالية مقارنة بتكلفته الفعلية؟',
    importance: 'المنتجات ذات القيمة المدركة العالية تُتيح لك تحديد أسعار أعلى، مما يزيد الربح.',
    example: 'ساعة أنيقة بتكلفة منخفضة ولكن بتصميم فاخر.',
    icon: <CheckCircle2 className="text-green-500" />
  },
  {
    id: 'reviews',
    en: 'Good Reviews?',
    ar: 'هل لديه تقييمات جيدة؟',
    description: 'هل المنتج حصل على تقييمات إيجابية على منصات البيع؟',
    importance: 'التقييمات الجيدة تُثبت أن العملاء راضون عن المنتج.',
    icon: <Star className="text-yellow-500 fill-yellow-500" />
  },
  {
    id: 'selling',
    en: 'Selling Right Now?',
    ar: 'هل يباع حالياً؟',
    description: 'هل المنتج موجود في السوق ويحقق مبيعات لجهات أخرى؟',
    importance: 'إذا كان المنتج يُباع بالفعل، فهذا دليل على وجود طلب عليه.',
    icon: <TrendingUp className="text-blue-500" />
  },
  {
    id: 'variants',
    en: 'Small / No Variants?',
    ar: 'هل المنتج بسيط أو ليس له تنويعات كثيرة؟',
    description: 'هل المنتج سهل (حجم واحد، لون واحد، نموذج واحد) أم يتطلب تنويعات متعددة؟',
    importance: 'كلما قلّت التنويعات، كان من السهل إدارته.',
    icon: <Layers className="text-indigo-500" />
  },
  {
    id: 'videos',
    en: 'Videos About Product / Problem?',
    ar: 'هل توجد فيديوهات عن المنتج أو المشكلة التي يحلها؟',
    description: 'هل توجد فيديوهات تشرح المنتج أو توضح المشكلة التي يعالجها؟',
    importance: 'الفيديوهات تُعتبر أدوات تسويقية فعالة لشرح المنتج.',
    icon: <Video className="text-red-500" />
  },
  {
    id: 'simulator',
    en: 'Product Simulator?',
    ar: 'هل يوجد محاكي للمنتج؟',
    description: 'هل يتوفر محاكي أو عرض توضيحي للمنتج؟',
    importance: 'المحاكي يساعد العملاء على فهم المنتج بشكل أفضل.',
    icon: <Laptop className="text-cyan-500" />
  },
  {
    id: 'testing',
    en: 'Testing?',
    ar: 'الاختبار؟',
    description: 'هل قمت باختبار المنتج على جمهورك المستهدف؟',
    importance: 'الاختبار يُتيح لك قياس الأداء من حيث النقرات والمبيعات.',
    icon: <TestTube className="text-amber-500" />
  },
  {
    id: 'audience',
    en: 'Clear Target Audience?',
    ar: 'هل المنتج له جمهور واضح؟',
    description: 'هل يمكن تحديد جمهور مستهدف محدد وواضح لهذا المنتج؟',
    importance: 'المنتج الذي يستهدف جمهورًا واضحًا يكون أسهل تسويقه.',
    icon: <Users className="text-orange-500" />
  },
  {
    id: 'visual',
    en: 'Visually Appealing?',
    ar: 'هل المنتج له عامل الجذب البصري؟',
    description: 'هل المنتج جذاب بصريًا ويسهل عرضه في الصور والفيديوهات؟',
    importance: 'المنتجات ذات المظهر الجذاب تحقق أداءً أفضل في الإعلانات.',
    icon: <Image className="text-pink-500" />
  },
  {
    id: 'shipping',
    en: 'Lightweight and Easy to Ship?',
    ar: 'هل المنتج خفيف الوزن وسهل الشحن؟',
    description: 'هل تكلفة شحن المنتج منخفضة بسبب وزنه أو حجمه؟',
    importance: 'الشحن السريع والمنخفض التكلفة يعزز رضا العميل.',
    icon: <Package className="text-emerald-500" />
  }
];

export function RatingQuestionnaire({ productId, initialAnswers, onClose, onSubmit }: RatingQuestionnaireProps) {
  const [answers, setAnswers] = useState<RatingAnswers>(initialAnswers || {});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  useEffect(() => {
    if (initialAnswers && Object.keys(initialAnswers).length > 0) {
      setAnswers(initialAnswers);
    }
  }, [initialAnswers]);

  const handleAnswer = (questionId: string, score: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      setSaveMessage({
        type: 'warning',
        text: `Please answer all ${questions.length} questions before submitting`
      });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      onSubmit(answers);
      setSaveMessage({ type: 'success', text: 'Rating submitted successfully' });
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to submit rating' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const answeredCount = Object.keys(answers).length;
  const remainingCount = questions.length - answeredCount;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl w-full max-w-2xl shadow-xl"
        onClick={handleModalClick}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Product Evaluation</h2>
            <p className="text-sm text-gray-500 mt-1">
              {remainingCount > 0 
                ? `${remainingCount} questions remaining`
                : 'All questions answered'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        {saveMessage && (
          <div className={`p-3 ${
            saveMessage.type === 'success' 
              ? 'bg-green-50 text-green-600' 
              : saveMessage.type === 'warning'
              ? 'bg-yellow-50 text-yellow-600'
              : 'bg-red-50 text-red-600'
          } flex items-center gap-2`}>
            <AlertCircle size={16} />
            {saveMessage.text}
          </div>
        )}

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {questions.map((question) => (
            <div 
              key={question.id} 
              className={`space-y-2 bg-gray-50 rounded-lg p-4 transition-all ${
                expandedQuestion === question.id ? 'ring-2 ring-purple-200' : ''
              }`}
              onClick={() => setExpandedQuestion(
                expandedQuestion === question.id ? null : question.id
              )}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  {question.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{question.en}</p>
                  <p className="text-gray-600 text-right" dir="rtl">{question.ar}</p>
                </div>
              </div>

              {expandedQuestion === question.id && (
                <div className="mt-4 space-y-3 text-sm text-gray-600" dir="rtl">
                  {question.description && (
                    <p className="bg-white p-3 rounded-lg">
                      <span className="font-medium">السؤال: </span>
                      {question.description}
                    </p>
                  )}
                  {question.importance && (
                    <p className="bg-white p-3 rounded-lg">
                      <span className="font-medium">لماذا هذا مهم؟: </span>
                      {question.importance}
                    </p>
                  )}
                  {question.example && (
                    <p className="bg-white p-3 rounded-lg">
                      <span className="font-medium">مثال: </span>
                      {question.example}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-center gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnswer(question.id, score * 2);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      answers[question.id] === score * 2
                        ? 'bg-purple-100 text-purple-600'
                        : 'hover:bg-white text-gray-400'
                    }`}
                  >
                    <Star
                      size={24}
                      className={answers[question.id] >= score * 2 ? 'fill-current' : ''}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {answeredCount} of {questions.length} questions answered
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving || answeredCount < questions.length}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2 ${
                  answeredCount < questions.length
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Submit Rating
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}