import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingAnimationProps {
  progress: number;
  progressText: string;
  title?: string;
}

function LoadingAnimation({
  progress,
  progressText,
  title = 'Generating Response',
}: LoadingAnimationProps) {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="loading-container mt-12">
        {/* Floating 3D Cube */}
        <div className="cube-container">
          <div className="relative w-32 h-32 -mt-24">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A2A7A] to-[#7A4AAA] rounded-xl shadow-xl transform-style-3d animate-rotate">
              {/* Cube Faces */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A2A7A]/90 to-[#7A4AAA]/90 backdrop-blur-sm rounded-xl border border-white/20 transform translate-z-12"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A2A7A]/80 to-[#7A4AAA]/80 backdrop-blur-sm rounded-xl border border-white/20 transform -translate-z-12"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A2A7A]/70 to-[#7A4AAA]/70 backdrop-blur-sm rounded-xl border border-white/20 transform rotate-x-90 translate-z-12"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A2A7A]/70 to-[#7A4AAA]/70 backdrop-blur-sm rounded-xl border border-white/20 transform -rotate-x-90 translate-z-12"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A2A7A]/60 to-[#7A4AAA]/60 backdrop-blur-sm rounded-xl border border-white/20 transform -rotate-y-90 translate-z-12"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A2A7A]/60 to-[#7A4AAA]/60 backdrop-blur-sm rounded-xl border border-white/20 transform rotate-y-90 translate-z-12"></div>
            </div>
            {/* Centered Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-white animate-pulse-glow" />
            </div>
          </div>
        </div>

        {/* Progress Ring */}
        <svg className="progress-ring w-40 h-40">
          <circle
            className="text-white/5"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="60"
            cx="80"
            cy="80"
          />
          <circle
            className="progress-indicator"
            strokeWidth="4"
            strokeLinecap="round"
            fill="transparent"
            r="60"
            cx="80"
            cy="80"
            style={{
              strokeDasharray: `${2 * Math.PI * 60}`,
              strokeDashoffset: `${2 * Math.PI * 60 * (1 - progress / 100)}`,
              stroke: `url(#progressGradient)`,
              filter: 'drop-shadow(0 0 4px rgba(122, 74, 170, 0.5))',
            }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A2A7A">
                <animate
                  attributeName="stop-color"
                  values="#4A2A7A; #7A4AAA; #9A6ACA; #7A4AAA; #4A2A7A"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#7A4AAA">
                <animate
                  attributeName="stop-color"
                  values="#7A4AAA; #9A6ACA; #7A4AAA; #4A2A7A; #7A4AAA"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>
        </svg>

        {/* Percentage Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">{progress}%</span>
        </div>

        {/* Glowing Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-3 bg-[#7A4AAA] blur-xl opacity-50 animate-pulse"></div>
      </div>

      {/* Loading Text */}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-white/60">{progressText || 'Processing your request...'}</p>
      </div>
    </div>
  );
}

export default LoadingAnimation;
