import { useState } from "react";
import { X, Bot } from "lucide-react";
import MultiBot from "./MultiBot";

const AiBot = () => {
  const [isMultiBotOpen, setIsMultiBotOpen] = useState(false);

  return (
    <div>
      {/* AI Bot Button */}
      <button
        onClick={() => setIsMultiBotOpen(true)}
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group z-40"
      >
        <Bot
          size={32}
          className="text-white transform transition-transform duration-300 group-hover:scale-110"
        />
      </button>

      {/* MultiBot Modal */}
      {isMultiBotOpen && (
        <MultiBotModal isOpen={isMultiBotOpen} onClose={() => setIsMultiBotOpen(false)} />
      )}
    </div>
  );
};

const MultiBotModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-200"
        >
          <X size={32} />
        </button>

        {/* MultiBot Content */}
        <div className="w-full h-full bg-white p-4 md:p-8 rounded-lg shadow-lg overflow-hidden">
          <MultiBot />
        </div>
      </div>
    </div>
  );
};

export default AiBot;


