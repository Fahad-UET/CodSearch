import React from 'react';
import { Check, X } from 'lucide-react';
import { Tooltip } from './ui/Tooltip';
import { useLanguageStore } from '../store/languageStore';

interface PricingComparisonTableProps {
  language: 'en' | 'ar';
}

const translations = {
  en: {
    categories: {
      boardManagement: 'Board Management',
      dataTrack: 'Data Track Extension',
      usefulApps: 'Useful Applications',
      productivity: 'Advanced Productivity Tools',
      videoDownload: 'Video Download',
      photoDownload: 'Photo Download',
      landingPage: 'Landing Page Download',
      adCopy: 'AdCopy Management',
      reviews: 'Customer Review Management',
      aiVoice: 'AI Voice',
      keyboard: 'Multilingual Keyboard',
      priceManagement: 'Price Management',
      serviceCharge: 'Service Charge Management',
      monthlyCharges: 'Monthly Charges Calculator',
      adTesting: 'Ad Testing',
      marketStudy: 'Market Study and Analysis',
      fileManagement: 'File Management'
    }
  },
  ar: {
    categories: {
      boardManagement: 'إدارة اللوحات',
      dataTrack: 'إضافة تتبع البيانات',
      usefulApps: 'تطبيقات مفيدة',
      productivity: 'أدوات الإنتاجية المتقدمة',
      videoDownload: 'تحميل الفيديو',
      photoDownload: 'تحميل الصور',
      landingPage: 'تحميل صفحات الهبوط',
      adCopy: 'إدارة النصوص الإعلانية',
      reviews: 'إدارة تقييمات العملاء',
      aiVoice: 'الصوت الذكي',
      keyboard: 'لوحة المفاتيح متعددة اللغات',
      priceManagement: 'إدارة الأسعار',
      serviceCharge: 'إدارة رسوم الخدمة',
      monthlyCharges: 'حاسبة الرسوم الشهرية',
      adTesting: 'اختبار الإعلانات',
      marketStudy: 'دراسة وتحليل السوق',
      fileManagement: 'إدارة الملفات'
    }
  }
};

export function PricingComparisonTable({ language }: PricingComparisonTableProps) {
  const t = translations[language];
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const features = [
    {
      category: t.categories.boardManagement,
      description: 'Manage your boards, lists and products',
      items: [
        {
          name: 'Boards',
          description: 'Number of boards you can create',
          starter: '1',
          pro: '5',
          business: 'Unlimited'
        },
        {
          name: 'Lists per Board',
          description: 'Number of lists allowed per board',
          starter: '5',
          pro: '20',
          business: 'Unlimited'
        },
        {
          name: 'Products',
          description: 'Total number of products across all boards',
          starter: '50',
          pro: '150',
          business: '500'
        },
        {
          name: 'Board Sharing',
          starter: false,
          pro: true,
          business: true
        },
        {
          name: 'List Sharing',
          starter: false,
          pro: true,
          business: true
        }
      ]
    },
    // Add more categories and their features here...
    {
      category: t.categories.dataTrack,
      description: 'Browser extension features',
      items: [
        {
          name: 'Automatic Data Transfer',
          description: 'Automatically transfer photos, videos, texts and more',
          starter: true,
          pro: true,
          business: true
        }
      ]
    },
    {
      category: t.categories.usefulApps,
      description: 'Helpful productivity applications',
      items: [
        {
          name: 'Currency Exchange',
          description: 'Real-time currency conversion',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'Local Time',
          description: 'Automatic timezone adaptation',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'Pomodoro Timer',
          description: 'Productivity and focus management',
          starter: true,
          pro: true,
          business: true
        }
      ]
    },
    {
      category: t.categories.productivity,
      description: 'Advanced productivity tools',
      items: [
        {
          name: 'Multilingual Virtual Keyboard',
          description: 'Support for Arabic, Spanish, English, French',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'Quick Notes',
          description: 'Organized with tags, stars, and categories',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'SMART Goal Tracking',
          description: 'Track and manage intelligent goals',
          starter: false,
          pro: true,
          business: true
        }
      ]
    },
    {
      category: t.categories.videoDownload,
      description: 'Video download capabilities',
      items: [
        {
          name: 'Star Ratings',
          description: 'Organize and rate videos',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'Multi-Platform Support',
          description: 'Support for TikTok, YouTube, Snapchat, Facebook',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'Custom Platform Configuration',
          description: 'Configure download options for each platform',
          starter: false,
          pro: true,
          business: true
        }
      ]
    },
    {
      category: t.categories.photoDownload,
      description: 'Photo download features',
      items: [
        {
          name: 'Star Ratings',
          description: 'Organize and rate photos',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'GIF/Photo Management',
          description: 'Simplified photo and GIF management',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'Batch Downloads',
          description: 'Download multiple photos at once',
          starter: false,
          pro: true,
          business: true
        }
      ]
    },
    {
      category: t.categories.landingPage,
      description: 'Landing page scraping features',
      items: [
        {
          name: 'Full Page Scraping',
          description: 'Extract entire landing pages',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'Selective Downloads',
          description: 'Choose specific elements to download',
          starter: false,
          pro: true,
          business: true
        },
        {
          name: 'OCR Extraction',
          description: 'Extract text from images (Arabic/English)',
          starter: false,
          pro: true,
          business: true
        }
      ]
    },
    {
      category: t.categories.adCopy,
      description: 'Ad copy management features',
      items: [
        {
          name: 'Basic Organization',
          description: 'Tags, ratings, and categories',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'Quick Templates',
          description: 'Create ad copies instantly',
          starter: false,
          pro: true,
          business: true
        },
        {
          name: 'AI Integration',
          description: 'Generate ad copies with ChatGPT',
          starter: false,
          pro: true,
          business: true
        }
      ]
    },
    {
      category: t.categories.reviews,
      description: 'Customer review management',
      items: [
        {
          name: 'Basic Review Management',
          description: 'Create and edit reviews',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'AI Review Generation',
          description: 'Generate reviews with ChatGPT',
          starter: false,
          pro: true,
          business: true
        }
      ]
    },
    {
      category: t.categories.aiVoice,
      description: 'AI voice generation features',
      items: [
        {
          name: 'ElevenLabs Integration',
          description: 'Generate AI voiceovers',
          starter: false,
          pro: false,
          business: true
        }
      ]
    },
    {
      category: t.categories.priceManagement,
      description: 'Price management tools',
      items: [
        {
          name: 'Basic Calculators',
          description: 'Selling, sourcing, and profit calculations',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'Advanced Analytics',
          description: 'Detailed pricing analytics',
          starter: false,
          pro: true,
          business: true
        }
      ]
    },
    {
      category: t.categories.serviceCharge,
      description: 'Service charge management',
      items: [
        {
          name: 'Basic Management',
          description: 'Manage service charges',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'Custom Services',
          description: 'Create custom service providers',
          starter: false,
          pro: true,
          business: true
        }
      ]
    },
    {
      category: t.categories.monthlyCharges,
      description: 'Monthly expense tracking',
      items: [
        {
          name: 'Expense Tracking',
          description: 'Track monthly expenses',
          starter: false,
          pro: false,
          business: true
        }
      ]
    },
    {
      category: t.categories.adTesting,
      description: 'Ad testing and analysis',
      items: [
        {
          name: 'Basic Analytics',
          description: 'Track ad performance',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'Advanced Analytics',
          description: 'Detailed performance insights',
          starter: false,
          pro: true,
          business: true
        },
        {
          name: 'Custom Reports',
          description: 'Create custom analytics reports',
          starter: false,
          pro: false,
          business: true
        }
      ]
    },
    {
      category: t.categories.marketStudy,
      description: 'Market analysis tools',
      items: [
        {
          name: 'SWOT Analysis',
          description: 'Strengths, Weaknesses, Opportunities, Threats',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'AIDA Analysis',
          description: 'Attention, Interest, Desire, Action',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'Custom Analysis',
          description: 'Create custom analysis templates',
          starter: false,
          pro: false,
          business: true
        }
      ]
    },
    {
      category: t.categories.fileManagement,
      description: 'File management features',
      items: [
        {
          name: 'Basic Storage',
          description: 'Store and manage files',
          starter: true,
          pro: true,
          business: true
        },
        {
          name: 'Google Drive Integration',
          description: 'Sync with Google Drive',
          starter: false,
          pro: true,
          business: true
        },
        {
          name: 'Advanced Sharing',
          description: 'Advanced file sharing options',
          starter: false,
          pro: false,
          business: true
        }
      ]
    }
  ];

  return (
    <div className={`bg-white rounded-xl shadow-xl overflow-hidden ${dir === 'rtl' ? 'font-arabic' : ''}`} dir={dir}>
      <div className="px-6 py-8 bg-gradient-to-r from-purple-600 to-indigo-600">
        <h2 className="text-2xl font-bold text-white text-center">
          Detailed Feature Comparison
        </h2>
      </div>

      <div className="overflow-x-auto max-h-[600px]">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Features</th>
              <th className="py-4 px-6 text-center text-sm font-medium text-gray-500">Starter</th>
              <th className="py-4 px-6 text-center text-sm font-medium text-gray-500">Pro</th>
              <th className="py-4 px-6 text-center text-sm font-medium text-gray-500">Business</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {features.map((category, categoryIndex) => (
              <React.Fragment key={categoryIndex}>
                {/* Category Header */}
                <tr className="bg-purple-50">
                  <td
                    colSpan={4}
                    className="py-3 px-6 text-sm font-semibold text-purple-700"
                  >
                    {category.category}
                  </td>
                </tr>
                {/* Category Features */}
                {category.items.map((feature, featureIndex) => (
                  <tr key={`${categoryIndex}-${featureIndex}`}>
                    <td className="py-3 px-6 text-sm text-gray-900">
                      <Tooltip content={feature.description}>
                        <span className="cursor-help">{feature.name}</span>
                      </Tooltip>
                    </td>
                    <td className="py-3 px-6 text-center">
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? (
                          <Check className="mx-auto w-5 h-5 text-green-500" />
                        ) : (
                          <X className="mx-auto w-5 h-5 text-red-500" />
                        )
                      ) : (
                        <span className="text-sm text-gray-900">{feature.starter}</span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="mx-auto w-5 h-5 text-green-500" />
                        ) : (
                          <X className="mx-auto w-5 h-5 text-red-500" />
                        )
                      ) : (
                        <span className="text-sm text-gray-900">{feature.pro}</span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {typeof feature.business === 'boolean' ? (
                        feature.business ? (
                          <Check className="mx-auto w-5 h-5 text-green-500" />
                        ) : (
                          <X className="mx-auto w-5 h-5 text-red-500" />
                        )
                      ) : (
                        <span className="text-sm text-gray-900">{feature.business}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}