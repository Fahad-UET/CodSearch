import { useState } from 'react';
import { Search } from 'lucide-react';

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Documentation</h1>
      
      {/* Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Rechercher dans la documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <CategoryCard 
          title="Outils de base" 
          description="Fonctionnalités essentielles pour démarrer"
          count={5}
        />
        <CategoryCard 
          title="Fonctionnalités avancées" 
          description="Outils pour utilisateurs expérimentés"
          count={8}
        />
        <CategoryCard 
          title="Intégrations" 
          description="Connexions avec d'autres services"
          count={3}
        />
      </div>

      {/* Recent Documentation */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Documentation récente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentCard 
            title="Guide du débutant"
            description="Apprenez les bases de l'application"
            date="Mis à jour il y a 2 jours"
          />
          <DocumentCard 
            title="Configuration avancée"
            description="Paramètres et personnalisation"
            date="Mis à jour il y a 1 semaine"
          />
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ title, description, count }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <span className="text-sm text-primary-600">{count} articles</span>
    </div>
  );
}

function DocumentCard({ title, description, date }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <span className="text-sm text-gray-500">{date}</span>
    </div>
  );
}