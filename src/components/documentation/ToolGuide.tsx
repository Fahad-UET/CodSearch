import React from 'react';
import { useParams } from 'react-router-dom';
import { Play, FileText, HelpCircle, Lightbulb, BookOpen } from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
}

const guides: Record<string, {
  title: string;
  description: string;
  sections: GuideSection[];
}> = {
  'price-manager': {
    title: 'Gestionnaire de Prix',
    description: 'Apprenez à utiliser efficacement le gestionnaire de prix pour optimiser vos marges',
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: 'Le gestionnaire de prix est un outil puissant qui vous permet de...',
        videoUrl: 'https://www.youtube.com/embed/example'
      },
      {
        id: 'basic-usage',
        title: 'Utilisation de base',
        content: 'Pour commencer à utiliser le gestionnaire de prix...'
      },
      {
        id: 'advanced-features',
        title: 'Fonctionnalités avancées',
        content: 'Découvrez les fonctionnalités avancées comme...'
      }
    ]
  }
  // Add more tool guides here
};

export default function ToolGuide() {
  const { toolId } = useParams<{ toolId: string }>();
  const guide = toolId ? guides[toolId] : null;

  if (!guide) {
    return <div>Guide non trouvé</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{guide.title}</h1>
          <p className="mt-2 text-gray-600">{guide.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <nav className="space-y-1">
                {guide.sections.map(section => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <BookOpen className="h-5 w-5 mr-3 text-gray-400" />
                    {section.title}
                  </a>
                ))}
              </nav>

              {/* Download PDF Button */}
              <button className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition">
                <FileText className="h-5 w-5 mr-2" />
                Télécharger en PDF
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {guide.sections.map(section => (
                <div
                  key={section.id}
                  id={section.id}
                  className="p-6 border-b last:border-b-0"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  
                  {section.videoUrl && (
                    <div className="relative pb-9/16 mb-6">
                      <iframe
                        className="absolute inset-0 w-full h-full rounded-lg"
                        src={section.videoUrl}
                        title={section.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  <div className="prose max-w-none">
                    {section.content}
                  </div>

                  {/* Interactive Elements */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-primary-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <Lightbulb className="h-6 w-6 text-primary-500 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-primary-900">Astuce Pro</h4>
                          <p className="text-primary-700 text-sm mt-1">
                            Utilisez les raccourcis clavier pour accélérer votre workflow
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <HelpCircle className="h-6 w-6 text-gray-500 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">FAQ</h4>
                          <p className="text-gray-700 text-sm mt-1">
                            Réponses aux questions fréquentes sur cette fonctionnalité
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}