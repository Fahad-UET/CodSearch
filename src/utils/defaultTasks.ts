export const DEFAULT_TASKS_EN = {
  '1. Products': [
    // 'Sort the products',
    'SWOT analysis',
    'AIDA analysis',
    'Sourcing & selling price',
    'Profitability analysis',
  ],
  '2. Resource Searches': [
    'Find product pictures',
    'Find product videos',
    'Find product GIFs',
    'Collect customer reviews',
    'Gather marketing texts',
    'Research landing pages',
    'Research competitor pages and prices',
  ],
  '3.1 Video Editing': [
    'Resource preparation',
    'Record voice-over',
    'Edit video content',
    'Upload videos to drive',
  ],
  '3.2 Landing Pages': [
    'Write headline',
    'Write subheadline',
    'Create call-to-action (CTA)',
    'Add images/videos',
    'Add GIFs',
    'List benefits',
    'Add social proof',
    'Write promises',
    'Create value proposition',
    'Design form',
  ],
  '4. Media Buying': [
    'Set up ad accounts',
    'Define target audience',
    'Create ad campaigns',
    'Monitor performance',
    'Optimize campaigns',
  ],
};

export const DEFAULT_TASKS_AR = {
  '١. المنتجات': [
    // 'فرز المنتجات',
    'تحليل SWOT',
    'تحليل AIDA',
    'مصادر وتحديد سعر البيع',
    'تحليل الربحية',
  ],
  '٢. البحث عن الموارد': [
    'العثور على صور المنتجات',
    'العثور على فيديوهات المنتجات',
    'العثور على صور متحركة (GIFs) للمنتجات',
    'جمع مراجعات العملاء',
    'جمع نصوص التسويق',
    'البحث عن صفحات الهبوط',
    'البحث عن صفحات وأسعار المنافسين',
  ],
  '٣.١ تحرير الفيديو': [
    'تحضير الموارد',
    'تسجيل التعليق الصوتي',
    'تعديل محتوى الفيديو',
    'رفع الفيديوهات إلى القرص',
  ],
  '٣.٢ صفحات الهبوط': [
    'كتابة العنوان الرئيسي',
    'كتابة العنوان الفرعي',
    'إنشاء الدعوة إلى الإجراء (CTA)',
    'إضافة الصور/الفيديوهات',
    'إضافة الصور المتحركة (GIFs)',
    'سرد الفوائد',
    'إضافة شهادات العملاء (Social Proof)',
    'كتابة التعهدات',
    'إنشاء قيمة العرض',
    'تصميم النموذج',
  ],
  '٤. شراء الإعلانات': [
    'إعداد حسابات الإعلانات',
    'تحديد الجمهور المستهدف',
    'إنشاء حملات إعلانية',
    'مراقبة الأداء',
    'تحسين الحملات',
  ],
};
export interface TaskWithLanguage {
  id: string;
  text: string;
  textAr: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  categoryAr: string;
}

export function generateDefaultTasks(listId: string): TaskWithLanguage[] {
  const now = new Date();
  const tasks: TaskWithLanguage[] = [];

  // Add all tasks from all categories
  Object.entries(DEFAULT_TASKS_EN).forEach(([category, categoryTasks]) => {
    const categoryAr =
      Object.keys(DEFAULT_TASKS_AR)[Object.keys(DEFAULT_TASKS_EN).indexOf(category)];
    const categoryTasksAr = DEFAULT_TASKS_AR[categoryAr as keyof typeof DEFAULT_TASKS_AR];

    categoryTasks.forEach((taskText, index) => {
      tasks.push({
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: taskText,
        textAr: categoryTasksAr[index],
        completed: false,
        createdAt: now,
        updatedAt: now,
        category,
        categoryAr,
      });
    });
  });

  return tasks;
}
