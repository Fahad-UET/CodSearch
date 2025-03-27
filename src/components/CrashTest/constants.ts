export const SWOT_QUESTIONS = {
  strengths: [
    {
      id: 'uniqueness',
      en: 'Is the product unique compared to competitors?',
      ar: 'هل المنتج فريد مقارنة بالمنافسين؟',
      description: 'هل يتميز المنتج بخصائص فريدة تميزه عن المنافسين؟',
      importance: 'التميز يمنح المنتج ميزة تنافسية في السوق.',
      weight: 0.20 // 20% of strengths score
    },
    {
      id: 'profitMargin',
      en: 'Does the product have a high profit margin?',
      ar: 'هل هامش الربح للمنتج مرتفع؟',
      description: 'هل يحقق المنتج هامش ربح جيد مقارنة بتكلفته؟',
      importance: 'هامش الربح المرتفع يضمن استدامة المشروع.',
      weight: 0.30 // 30% of strengths score
    },
    {
      id: 'problemSolving',
      en: 'Does the product solve a specific problem?',
      ar: 'هل يحل المنتج مشكلة محددة؟',
      description: 'هل يقدم المنتج حلاً واضحاً لمشكلة يواجهها العملاء؟',
      importance: 'المنتجات التي تحل مشاكل حقيقية تلقى قبولاً أكبر.',
      weight: 0.30 // 30% of strengths score
    },
    {
      id: 'engagement',
      en: 'Does the product generate strong customer engagement?',
      ar: 'هل يجذب المنتج تفاعلًا قويًا من العملاء؟',
      description: 'هل يحصل المنتج على تفاعل وتعليقات ومشاركات من العملاء؟',
      importance: 'التفاعل القوي يدل على اهتمام حقيقي بالمنتج.',
      weight: 0.20 // 20% of strengths score
    }
  ],
  weaknesses: [
    {
      id: 'customerAcquisition',
      en: 'Is customer acquisition cost low?',
      ar: 'هل تكلفة اكتساب العملاء منخفضة؟',
      description: 'هل تكلفة الحصول على عملاء جدد منخفضة؟',
      importance: 'انخفاض تكلفة اكتساب العملاء يزيد من الربحية.',
      weight: 0.50 // 50% of weaknesses score
    },
    {
      id: 'durability',
      en: 'Is the product durable and resistant to damage?',
      ar: 'هل المنتج متين ومقاوم للتلف؟',
      description: 'هل المنتج قوي ويتحمل الاستخدام المتكرر؟',
      importance: 'متانة المنتج تقلل من المرتجعات والشكاوى.',
      weight: 0.15 // 15% of weaknesses score
    },
    {
      id: 'valueForMoney',
      en: 'Does the price reflect good value for quality?',
      ar: 'هل السعر يعكس قيمة عالية للمنتج مقارنة بالجودة؟',
      description: 'هل يشعر العملاء أن سعر المنتج يناسب جودته؟',
      importance: 'التوازن بين السعر والجودة يؤثر على قرار الشراء.',
      weight: 0.25 // 25% of weaknesses score
    },
    {
      id: 'competitivePrice',
      en: 'Is the product price competitive in the market?',
      ar: 'هل سعر المنتج تنافسي مقارنة بالمنافسين في السوق؟',
      description: 'هل سعر المنتج منافس مقارنة بالمنتجات المماثلة؟',
      importance: 'السعر التنافسي يزيد من فرص المبيعات.',
      weight: 0.10 // 10% of weaknesses score
    }
  ],
  opportunities: [
    {
      id: 'growth',
      en: 'Is demand for the product growing?',
      ar: 'هل الطلب على المنتج في نمو؟',
      description: 'هل هناك زيادة في الطلب على المنتج في السوق؟',
      importance: 'نمو الطلب يشير إلى فرص مستقبلية.',
      weight: 0.25 // 25% of opportunities score
    },
    {
      id: 'viral',
      en: 'Does the product have viral potential?',
      ar: 'هل للمنتج إمكانية الانتشار الفيروسي؟',
      description: 'هل يمكن للمنتج أن ينتشر بسرعة عبر وسائل التواصل؟',
      importance: 'الانتشار الفيروسي يقلل تكاليف التسويق.',
      weight: 0.60 // 60% of opportunities score
    },
    {
      id: 'seasonality',
      en: 'Is this the right season for the product?',
      ar: 'هل هذا هو الموسم المناسب للمنتج؟',
      description: 'هل توقيت طرح المنتج مناسب موسمياً؟',
      importance: 'التوقيت المناسب يزيد من فرص النجاح.',
      weight: 0.15 // 15% of opportunities score
    }
  ],
  threats: [
    {
      id: 'competition',
      en: 'Is competition for the product limited?',
      ar: 'هل المنافسة على المنتج محدودة؟',
      description: 'هل عدد المنافسين في السوق محدود؟',
      importance: 'المنافسة المحدودة تزيد من فرص النجاح.',
      weight: 0.35 // 35% of threats score
    },
    {
      id: 'reviews',
      en: 'Are customer reviews consistently positive?',
      ar: 'هل تقييمات العملاء إيجابية باستمرار؟',
      description: 'هل يحصل المنتج على تقييمات إيجابية من العملاء؟',
      importance: 'التقييمات الإيجابية تؤثر على قرارات الشراء.',
      weight: 0.50 // 50% of threats score
    },
    {
      id: 'priceThreat',
      en: 'Is there a risk of competitors lowering prices further?',
      ar: 'هل هناك خطر من أن يقوم المنافسون بتخفيض أسعارهم بشكل أكبر؟',
      description: 'هل هناك احتمال لحرب أسعار مع المنافسين؟',
      importance: 'تخفيض الأسعار من المنافسين يؤثر على الربحية.',
      weight: 0.15 // 15% of threats score
    }
  ]
};

export const SECTION_WEIGHTS = {
  strengths: 0.35,    // 35% of total score
  weaknesses: 0.35,   // 35% of total score
  opportunities: 0.15, // 15% of total score
  threats: 0.15       // 15% of total score
};

export const AIDA_QUESTIONS = {
  attention: [
    {
      id: 'immediateAttention',
      en: 'Does the product immediately capture attention?',
      ar: 'هل يجذب المنتج الانتباه فوراً؟',
      description: 'هل يتميز المنتج بعناصر تجذب انتباه العملاء من النظرة الأولى؟',
      importance: 'جذب الانتباه الفوري يزيد من فرص التفاعل مع المنتج.',
      weight: 0.40 // 40% of attention score
    },
    {
      id: 'visualAppeal',
      en: 'Does the product have attractive visual elements?',
      ar: 'هل للمنتج عناصر مرئية جذابة؟',
      description: 'هل التصميم والألوان والتغليف جذابة بصرياً؟',
      importance: 'العناصر المرئية الجذابة تساعد في لفت الانتباه وتحسين الانطباع الأول.',
      weight: 0.40 // 40% of attention score
    },
    {
      id: 'adEffectiveness',
      en: 'Are the ads and messages eye-catching?',
      ar: 'هل الإعلانات والرسائل تلفت النظر؟',
      description: 'هل الإعلانات والرسائل التسويقية تجذب انتباه العملاء المحتملين؟',
      importance: 'الإعلانات الجذابة تزيد من فعالية الحملات التسويقية.',
      weight: 0.20 // 20% of attention score
    }
  ],
  interest: [
    {
      id: 'features',
      en: 'Do product features generate customer interest?',
      ar: 'هل مميزات المنتج تثير اهتمام العملاء؟',
      description: 'هل خصائص ومميزات المنتج تجعل العملاء مهتمين بمعرفة المزيد؟',
      importance: 'المميزات المثيرة للاهتمام تشجع على التعرف أكثر على المنتج.',
      weight: 0.40 // 40% of interest score
    },
    {
      id: 'valuePerception',
      en: 'Do customers perceive clear added value?',
      ar: 'هل يدرك العملاء قيمة مضافة واضحة؟',
      description: 'هل يرى العملاء قيمة واضحة في المنتج تميزه عن المنافسين؟',
      importance: 'إدراك القيمة المضافة يبرر السعر ويزيد الاهتمام بالمنتج.',
      weight: 0.40 // 40% of interest score
    },
    {
      id: 'marketingMessages',
      en: 'Do marketing messages spark curiosity?',
      ar: 'هل الرسائل التسويقية تثير الفضول؟',
      description: 'هل تثير الرسائل التسويقية فضول العملاء لمعرفة المزيد؟',
      importance: 'إثارة الفضول تزيد من احتمالية التفاعل مع المنتج.',
      weight: 0.20 // 20% of interest score
    }
  ],
  desire: [
    {
      id: 'needCreation',
      en: 'Does the product create a sense of need?',
      ar: 'هل يخلق المنتج شعوراً بالحاجة؟',
      description: 'هل يشعر العملاء بأنهم بحاجة إلى هذا المنتج؟',
      importance: 'خلق الشعور بالحاجة يحفز قرار الشراء.',
      weight: 0.35 // 35% of desire score
    },
    {
      id: 'differentiation',
      en: 'Is the product clearly differentiated?',
      ar: 'هل المنتج متميز بوضوح؟',
      description: 'هل يتميز المنتج بشكل واضح عن المنافسين؟',
      importance: 'التمييز الواضح يجعل المنتج أكثر جاذبية للشراء.',
      weight: 0.35 // 35% of desire score
    },
    {
      id: 'emotionalMarketing',
      en: 'Is emotional marketing effectively used?',
      ar: 'هل يتم استخدام التسويق العاطفي بفعالية؟',
      description: 'هل يستخدم المنتج التسويق العاطفي بشكل فعال لإثارة الرغبة؟',
      importance: 'التسويق العاطفي يقوي الرغبة في الشراء.',
      weight: 0.30 // 30% of desire score
    }
  ],
  action: [
    {
      id: 'callToAction',
      en: 'Are customers encouraged to take immediate action?',
      ar: 'هل يتم تشجيع العملاء على اتخاذ إجراء فوري؟',
      description: 'هل هناك حوافز واضحة للشراء الفوري؟',
      importance: 'التحفيز على اتخاذ إجراء فوري يزيد من معدلات التحويل.',
      weight: 0.60 // 60% of action score
    },
    {
      id: 'purchaseProcess',
      en: 'Is the purchase process simple and quick?',
      ar: 'هل عملية الشراء بسيطة وسريعة؟',
      description: 'هل يمكن إتمام عملية الشراء بسهولة وسرعة؟',
      importance: 'سهولة عملية الشراء تقلل من معدلات التخلي عن الشراء.',
      weight: 0.40 // 40% of action score
    }
  ]
};

export const AIDA_WEIGHTS = {
  attention: 0.25,   // 25% of total score
  interest: 0.25,    // 25% of total score
  desire: 0.30,      // 30% of total score
  action: 0.20       // 20% of total score
};