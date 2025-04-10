
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Video,
  Mic,
  Music,
  Image as ImageIcon,
  MessageSquare,
  Clapperboard,
  ChevronLeft,
  Eraser,
  Replace,
  Scissors,
  UserPlus,
  FileText,
  Shirt,
  Package,
  Maximize2,
  Volume2,
  Sparkles,
  Wand2,
  ArrowLeft,
  DollarSign,
  FileImage,
  Shuffle, // Added DollarSign import for Credits
} from 'lucide-react';

interface NavCategory {
  title: string;
  icon: JSX.Element;
  links: {
    to: string;
    icon: JSX.Element;
    label: string;
  }[];
}

interface sidebarProps {
  isCollapsed: boolean;
  onBack: () => void;
  setIsCollapsed: () => void;
}

function Sidebar({ onBack, isCollapsed, setIsCollapsed }: sidebarProps) {
  const [hoveredLink, setHoveredLink] = React.useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>('Video Tools');
  const location = useLocation();

  // Function to find which category contains the current route
  const findActiveCategory = () => {
    const currentPath = location.pathname;
    return (
      categories.find(category => category.links.some(link => link.to === currentPath))?.title ||
      categories[0].title
    );
  };

  // Update expanded category when route changes
  React.useEffect(() => {
    if (isCollapsed) {
      setExpandedCategory(findActiveCategory());
    }
  }, [location.pathname, isCollapsed]);

  const categories: NavCategory[] = [
    {
      title: 'Text Tools',
      icon: <MessageSquare />,
      links: [
        { to: '/prompt', icon: <Sparkles />, label: 'Video Prompt' },
        { to: '/text', icon: <MessageSquare />, label: 'Text to Text' },
        { to: '/text-to-image', icon: <ImageIcon />, label: 'Text to Image' },
        { to: '/veo2', icon: <Clapperboard />, label: 'Text to Video' },
      ],
    },
    {
      title: 'Audio Tools',
      icon: <Volume2 />,
      links: [
        { to: '/text-to-speech', icon: <Mic />, label: 'Text to Speech' },
        { to: '/transcribe', icon: <Mic />, label: 'Speech to Text' },
        // { to: '/speech-to-video', icon: <Video />, label: 'Speech to Video' },
        { to: '/lipsync', icon: <Music />, label: 'Lip Sync' },
        { to: '/video-to-audio', icon: <Music />, label: 'Video to Audio' },
      ],
    },
    {
      title: 'Image Tools',
      icon: <ImageIcon />,
      links: [
        { to: '/text-to-image', icon: <ImageIcon />, label: 'Text to Image' },
        { to: '/video', icon: <Video />, label: 'Image to Video' },
        { to: '/face-retoucher', icon: <Wand2 />, label: 'Face Retoucher' },
        { to: '/image-watermark-remover', icon: <Eraser />, label: 'Remove Watermark' },
        { to: '/change-image-background', icon: <Replace />, label: 'Change Background' },
        { to: '/remove-image-background', icon: <Scissors />, label: 'Remove Background' },
        { to: '/image-to-text', icon: <FileText />, label: 'Image to Text' },
        { to: '/image-upscaler', icon: <Maximize2 />, label: 'Upscaler' },
        { to: '/outfits-image', icon: <Shirt />, label: 'Outfits to Image' },
        // { to: '/product-image', icon: <Package />, label: 'Product to Image' },
      ],
    },
    {
      title: 'Video Tools',
      icon: <Video />,
      links: [
        { to: '/video', icon: <Video />, label: 'Image to Video' },
        { to: '/video-background-remover', icon: <Scissors />, label: 'Remove Background' },
        { to: '/video-watermark-remover', icon: <Eraser />, label: 'Remove Watermark' },
        { to: '/video-to-audio', icon: <Music />, label: 'Extract Audio' },
        { to: '/video-upscaler', icon: <Maximize2 />, label: 'Upscaler' },
        { to: '/video-to-frames', icon: <ImageIcon />, label: 'Video to Images' },
        { to: '/video-to-gif', icon: <FileImage />, label: 'Video to GIF' },
        { to: '/video-trimmer', icon: <Scissors />, label: 'Video Trimmer' },
        { to: '/video-mixer', icon: <Shuffle />, label: 'Video Mixer' },
        { to: '/veo2', icon: <Clapperboard />, label: 'Text to Video' },
        { to: '/outfits-video', icon: <Video />, label: 'Outfits Video' },
        { to: '/product-video', icon: <Video />, label: 'Product Video' },
        { to: '/face-swap', icon: <UserPlus />, label: 'Face Swap' },
      ],
    },
    {
      title: 'Fashion Tools',
      icon: <Shirt />,
      links: [
        { to: '/outfits-image', icon: <Shirt />, label: 'Outfits Image' },
        { to: '/outfits-video', icon: <Video />, label: 'Outfits Video' },
      ],
    },
    {
      title: 'Product Tools',
      icon: <Package />,
      links: [
        // { to: '/product-image', icon: <Package />, label: 'Product Shot' },
        { to: '/product-variations', icon: <Package />, label: 'Variations' },
        { to: '/product-video', icon: <Video />, label: 'Product Video' },
        { to: '/product-replace', icon: <Replace />, label: 'Replace Objects' },
      ],
    },
    {
      title: 'Credits',
      icon: <DollarSign />,
      links: [
        { to: '/credits', icon: <DollarSign />, label: 'Credits/1k tokens' },
      ],
    },
  ];

  return (
    <div
      className={`sidebar fixed left-0 top-100 h-screen bg-white/[0.03] backdrop-blur-lg border-r border-white-10 transition-all duration-300 ${
        isCollapsed ? 'w-14' : 'w-52'
      } shadow-[0_0_80px_-12px_rgba(154,106,202,0.3)] transform-style-3d perspective-1000 mt-11 overflow-hidden overflow-y-auto`}
      style={{ zIndex: '3' }}
    >
      <NavLink
        to="/"
        replace
        onClick={onBack}
        className="text-white/80 hover:text-white flex items-center gap-2 transition-colors duration-300 hover:bg-white/5 rounded-lg p-2"
      >
        <ArrowLeft size={20} />
      </NavLink>
      {/* Glowing border effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5 pointer-events-none rounded-r-xl" />

      <button
        onClick={setIsCollapsed}
        className={`absolute ${
          isCollapsed ? 'left-1 top-10' : 'right-0 top-1'
        } p-1.5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-full border border-white/20 text-white/70 hover:text-white transition-all duration-300 hover:shadow-[0_0_25px_-5px_rgba(154,106,202,0.6)] transform hover:scale-110 hover:rotate-[360deg]`}
      >
        <ChevronLeft
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div className="p-4 h-16 flex items-center border-b border-white/10 bg-gradient-to-r from-white/[0.04] to-transparent">
        {!isCollapsed && (
          <span className="text-lg font-semibold bg-gradient-to-br from-white via-[#E2D1FF] to-[#9A6ACA] bg-clip-text text-transparent">
            AI Tools Hub
          </span>
        )}
      </div>

      <nav className="p-2 space-y-1">
        {categories.map(category => {
          // When collapsed, only show the active category
          if (isCollapsed && category.title !== expandedCategory) {
            return null;
          }

          return (
            <div key={category.title} className="space-y-1">
              <button
                onClick={() =>
                  setExpandedCategory(expandedCategory === category.title ? null : category.title)
                }
                className={`
                  w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-2.5 py-2
                  rounded-xl transition-all duration-300 text-white/70 hover:text-white
                  backdrop-blur-md border border-white/5 hover:border-white/10
                  ${expandedCategory === category.title ? 'bg-white/5' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4">{category.icon}</div>
                  {!isCollapsed && <span className="font-medium text-sm">{category.title}</span>}
                </div>
                {!isCollapsed && (
                  <div
                    className={`transition-transform duration-300 ${expandedCategory === category.title ? 'rotate-180' : ''}`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5 rotate-90" />
                  </div>
                )}
              </button>

              {(expandedCategory === category.title || isCollapsed) && (
                <div className={`pl-${isCollapsed ? '0' : '4'} space-y-1 animate-fade-in`}>
                  {category.links.map(link => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onMouseEnter={() => setHoveredLink(link.to)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className={({ isActive }) => `
                        relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} 
                        px-3 py-2.5 rounded-xl transition-all duration-300
                        backdrop-blur-md border border-transparent transform-style-3d
                        ${
                          isActive
                            ? 'bg-gradient-to-r from-[#4A2A7A]/60 to-[#7A4AAA]/40 text-white border-white/20 shadow-[0_0_35px_-10px_rgba(154,106,202,0.5)] translate-z-12'
                            : 'text-white/70 hover:bg-white/5 hover:text-white hover:border-white/10 hover:translate-z-12'
                        }
                        ${
                          hoveredLink === link.to && !isActive
                            ? 'transform scale-[1.02] shadow-[0_0_30px_-5px_rgba(154,106,202,0.3)]'
                            : ''
                        }
                      `}
                    >
                      <div
                        className={`w-4 h-4 transition-all duration-300 ${isCollapsed ? 'scale-110' : ''} group-hover:scale-110 group-hover:text-[#9A6ACA]`}
                      >
                        {link.icon}
                      </div>
                      {!isCollapsed && (
                        <span className="font-medium tracking-wide transition-colors duration-300 text-sm">
                          {link.label}
                        </span>
                      )}
                      {/* Glowing hover effect */}
                      <div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r from-[#4A2A7A]/0 via-[#9A6ACA]/10 to-[#4A2A7A]/0 opacity-0 transition-opacity durzation-300 pointer-events-none ${
                          hoveredLink === link.to ? 'opacity-80' : ''
                        }`}
                      />
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
