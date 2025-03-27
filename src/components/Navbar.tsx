import { Link } from 'react-router-dom';
import { Home, ShoppingBag, Settings, User, BookOpen, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:top-0 md:bottom-auto">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-around items-center">
          <Link 
            to="/" 
            className="flex flex-col items-center p-2 text-gray-600 hover:text-primary-600"
          >
            <Home className="h-6 w-6" />
            <span>Accueil</span>
          </Link>
          <Link 
            to="/products" 
            className="flex flex-col items-center p-2 text-gray-600 hover:text-primary-600"
          >
            <ShoppingBag className="h-6 w-6" />
            <span>Produits</span>
          </Link>
          <Link 
            to="/documentation" 
            className="flex flex-col items-center p-2 text-gray-600 hover:text-primary-600"
          >
            <BookOpen className="h-6 w-6" />
            <span>Documentation</span>
          </Link>
          <Link 
            to="/settings" 
            className="flex flex-col items-center p-2 text-gray-600 hover:text-primary-600"
          >
            <Settings className="h-6 w-6" />
            <span>Paramètres</span>
          </Link>
          <Link 
            to="/profile" 
            className="flex flex-col items-center p-2 text-gray-600 hover:text-primary-600"
          >
            <User className="h-6 w-6" />
            <span>Profil</span>
          </Link>
          <Link to="/boards" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <BookOpen className="w-5 h-5" />
            My Boards
          </Link>
        </div>
      </div>
    </nav>
  );
}