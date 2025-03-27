import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour à l'accueil
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Conditions d'Utilisation
        </h1>

        <div className="prose prose-blue max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              1. Acceptation des Conditions
            </h2>
            <p className="text-gray-600 mb-4">
              En accédant et en utilisant cod-track.com, vous acceptez d'être lié par ces conditions 
              d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              2. Description du Service
            </h2>
            <p className="text-gray-600 mb-4">
              cod-track.com est une plateforme professionnelle de recherche et de suivi de produits 
              qui permet aux utilisateurs de gérer leurs recherches de produits et d'analyser leur 
              potentiel commercial.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              3. Comptes Utilisateurs
            </h2>
            <p className="text-gray-600 mb-4">
              Pour utiliser certaines fonctionnalités du service, vous devez créer un compte. Vous 
              êtes responsable du maintien de la confidentialité de votre compte et de toutes les 
              activités qui s'y déroulent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              4. Propriété Intellectuelle
            </h2>
            <p className="text-gray-600 mb-4">
              Tout le contenu présent sur cod-track.com, incluant mais non limité aux textes, 
              graphiques, logos, images, et logiciels, est la propriété de cod-track.com ou de 
              ses fournisseurs de contenu.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              5. Limitation de Responsabilité
            </h2>
            <p className="text-gray-600 mb-4">
              cod-track.com ne peut être tenu responsable des dommages directs ou indirects 
              résultant de l'utilisation ou de l'impossibilité d'utiliser nos services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              6. Modifications des Conditions
            </h2>
            <p className="text-gray-600 mb-4">
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les 
              modifications entrent en vigueur dès leur publication sur le site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              7. Contact
            </h2>
            <p className="text-gray-600">
              Pour toute question concernant ces conditions d'utilisation, veuillez nous 
              contacter à l'adresse : support@cod-track.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}