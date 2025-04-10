
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Music, ImageIcon, MessageSquare, Package, Sparkles, ArrowRight, Shirt, Eraser, Replace, Scissors, UserPlus, FileText, Maximize2, Wand2, HelpCircle, Clapperboard, SplitSquareVertical as SplitSquare, Mic, Volume2, Link2, Download } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Text Generation",
      icon: <MessageSquare className="w-8 h-8" />,
      tools: [
        {
          name: "Text to Image",
          path: "/text-to-image",
          icon: <ImageIcon className="w-4 h-4" />
        },
        {
          name: "Text Generator",
          path: "/text",
          icon: <MessageSquare className="w-4 h-4" />
        },
        {
          name: "Text to Video",
          path: "/veo2",
          icon: <Video className="w-4 h-4" />
        }
      ]
    },
    {
      title: "Audio Processing",
      icon: <Music className="w-8 h-8" />,
      tools: [
        {
          name: "Text to Speech",
          path: "/text-to-speech",
          icon: <Volume2 className="w-4 h-4" />
        },
        {
          name: "Voice Design",
          path: "/text-to-speech",
          icon: <Sparkles className="w-4 h-4" />
        },
        {
          name: "Voice Clone",
          path: "/text-to-speech",
          icon: <UserPlus className="w-4 h-4" />
        },
        {
          name: "Speech to Text",
          path: "/transcribe",
          icon: <Mic className="w-4 h-4" />
        },
        {
          name: "Lip Sync",
          path: "/lipsync",
          icon: <Music className="w-4 h-4" />
        },
        {
          name: "Speech to Video",
          path: "/speech-to-video",
          icon: <Video className="w-4 h-4" />
        },
        {
          name: "Video to Audio",
          path: "/video-to-audio",
          icon: <Music className="w-4 h-4" />
        }
      ]
    },
    {
      title: "Image Tools",
      icon: <ImageIcon className="w-8 h-8" />,
      tools: [
        {
          name: "Background Remover",
          path: "/remove-image-background",
          icon: <Eraser className="w-4 h-4" />
        },
        {
          name: "Face Retoucher",
          path: "/face-retoucher",
          icon: <Wand2 className="w-4 h-4" />
        },
        {
          name: "Watermark Remover",
          path: "/image-watermark-remover",
          icon: <Eraser className="w-4 h-4" />
        },
        {
          name: "Image Upscaler",
          path: "/image-upscaler",
          icon: <Maximize2 className="w-4 h-4" />
        },
        {
          name: "Change Background",
          path: "/change-image-background",
          icon: <Replace className="w-4 h-4" />
        },
        {
          name: "Text Extractor",
          path: "/image-to-text",
          icon: <FileText className="w-4 h-4" />
        },
        {
          name: "Product Shot",
          path: "/product-image",
          icon: <Package className="w-4 h-4" />
        }
      ]
    },
    {
      title: "Video Tools",
      icon: <Video className="w-8 h-8" />,
      tools: [
        {
          name: "Text to Video",
          path: "/veo2",
          icon: <Video className="w-4 h-4" />
        },
        {
          name: "Video Trimmer",
          path: "/video-trimmer",
          icon: <Scissors className="w-4 h-4" />
        },
        {
          name: "Background Remover",
          path: "/video-background-remover",
          icon: <Scissors className="w-4 h-4" />
        },
        {
          name: "Video Mixer",
          path: "/video-to-gif",
          icon: <Clapperboard className="w-4 h-4" />
        },
        {
          name: "Video Mixer",
          path: "/video-mixer",
          icon: <SplitSquare className="w-4 h-4" />
        },
        {
          name: "Video to Frames",
          path: "/video-to-frames",
          icon: <Scissors className="w-4 h-4" />
        },
        {
          name: "Video Upscaler",
          path: "/video-upscaler",
          icon: <Maximize2 className="w-4 h-4" />
        }
      ]
    },
    {
      title: "Fashion Tools",
      icon: <Shirt className="w-8 h-8" />,
      tools: [
        {
          name: "Fashion Shot",
          path: "/product-image",
          icon: <Shirt className="w-4 h-4" />
        },
        {
          name: "Fashion Variations", 
          path: "/product-variations",
          icon: <Shirt className="w-4 h-4" />
        },
        {
          name: "Fashion Objects",
          path: "/product-replace", 
          icon: <Replace className="w-4 h-4" />
        }
      ]
    },
    {
      title: "Product Tools",
      icon: <Package className="w-8 h-8" />,
      tools: [
        {
          name: "Product Variations",
          path: "/product-variations",
          icon: <Package className="w-4 h-4" />
        },
        {
          name: "Product Shot",
          path: "/product-image",
          icon: <Package className="w-4 h-4" />
        },
        {
          name: "Replace Objects",
          path: "/product-replace",
          icon: <Replace className="w-4 h-4" />
        },
        {
          name: "Product Video",
          path: "/product-video",
          icon: <Video className="w-4 h-4" />
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -inset-[10px] opacity-50">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#6A3ABA] to-[#4A2A7A] blur-[150px] animate-pulse"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#9A6ACA] to-[#7A4AAA] blur-[150px] animate-pulse delay-700"></div>
            <div className="absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#3A2A6A] to-[#2A1A5A] blur-[150px] animate-pulse delay-1000"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 text-transparent bg-clip-text mb-6">
              AI Tools Guide
            </h1>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto mb-12">
              Learn how to use our AI tools to enhance your workflow. Select a category below to get started.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {categories.map((category, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-[#4A2A7A] rounded-lg">
                    {category.icon}
                  </div>
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {category.tools.map((tool, toolIndex) => (
                    <button
                      key={toolIndex}
                      onClick={() => navigate(tool.path)}
                      className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-2">
                        {tool.icon}
                        <span className="text-xs font-medium truncate max-w-[100px]">{tool.name}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Clock,
//   DollarSign,
//   Wand2,
//   Video,
//   Music,
//   ImageIcon,
//   Eraser,
//   Mic,
//   Sparkles,
//   ArrowRight,
//   Timer,
//   BadgeCheck,
//   TrendingUp,
//   BarChart,
// } from 'lucide-react';

// function LandingPage() {
//   const navigate = useNavigate();

//   const features = [
//     {
//       icon: <Clock className="w-6 h-6" />,
//       title: 'Save 100+ Hours Monthly',
//       description: 'Automate repetitive tasks and focus on growing your business',
//     },
//     {
//       icon: <DollarSign className="w-6 h-6" />,
//       title: 'Increase ROI',
//       description: 'Convert more customers with professional product presentations',
//     },
//     {
//       icon: <TrendingUp className="w-6 h-6" />,
//       title: 'Scale Faster',
//       description: 'Create content 10x faster than traditional methods',
//     },
//     {
//       icon: <BadgeCheck className="w-6 h-6" />,
//       title: 'Professional Quality',
//       description: 'Generate studio-quality content automatically',
//     },
//   ];

//   const tools = [
//     {
//       icon: <Eraser className="w-8 h-8" />,
//       title: 'Watermark Remover',
//       description:
//         'Remove watermarks from product images and videos instantly. Save $100s on stock photos.',
//       path: '/image-watermark-remover',
//       stats: 'Save 2-3 hours per product',
//       highlight: true,
//     },
//     {
//       icon: <Mic className="w-8 h-8" />,
//       title: 'Voice Creator & Cloning',
//       description:
//         'Create custom AI voices for your brand or clone your voice for consistent messaging.',
//       path: '/text-to-speech',
//       stats: 'Save 5-6 hours per video',
//       highlight: true,
//     },
//     {
//       icon: <Music className="w-8 h-8" />,
//       title: 'Lip Sync Technology',
//       description:
//         'Automatically sync any voice with any video for perfect product demonstrations.',
//       path: '/lipsync',
//       stats: 'Save 4-5 hours per video',
//       highlight: true,
//     },
//     {
//       icon: <Video className="w-8 h-8" />,
//       title: 'World-Class Video AI',
//       description:
//         'Generate stunning product videos from images. Best-in-class AI video generation.',
//       path: '/video',
//       stats: 'Save 8-10 hours per video',
//       highlight: true,
//     },
//     {
//       icon: <ImageIcon className="w-8 h-8" />,
//       title: 'Image Enhancement',
//       description: 'Upscale and enhance product images automatically.',
//       path: '/image-upscaler',
//       stats: 'Save 1-2 hours per product',
//     },
//     {
//       icon: <Wand2 className="w-8 h-8" />,
//       title: 'Background Remover',
//       description: 'Remove and replace product backgrounds instantly.',
//       path: '/remove-image-background',
//       stats: 'Save 2-3 hours per product',
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-[#050510] text-white">
//       {/* Hero Section */}
//       <div className="relative overflow-hidden">
//         {/* Animated background */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -inset-[10px] opacity-50">
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#6A3ABA] to-[#4A2A7A] blur-[150px] animate-pulse"></div>
//             <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#9A6ACA] to-[#7A4AAA] blur-[150px] animate-pulse delay-700"></div>
//             <div className="absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#3A2A6A] to-[#2A1A5A] blur-[150px] animate-pulse delay-1000"></div>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
//           <div className="text-center">
//             <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 text-transparent bg-clip-text mb-6">
//               Transform Your E-commerce with AI
//             </h1>
//             <p className="text-xl text-purple-200 max-w-3xl mx-auto mb-12">
//               Save hundreds of hours and thousands of dollars with our suite of AI tools designed
//               specifically for e-commerce sellers.
//             </p>
//           </div>

//           {/* Features Grid */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
//             {features.map((feature, index) => (
//               <div
//                 key={index}
//                 className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
//               >
//                 <div className="text-purple-400 mb-4">{feature.icon}</div>
//                 <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
//                 <p className="text-sm text-gray-400">{feature.description}</p>
//               </div>
//             ))}
//           </div>

//           {/* Tools Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {tools.map((tool, index) => (
//               <button
//                 key={index}
//                 onClick={() => navigate(tool.path)}
//                 className={`group relative bg-white/5 backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 transform hover:translate-y-[-4px] hover:shadow-2xl ${
//                   tool.highlight
//                     ? 'border-purple-500/30 hover:border-purple-500/50'
//                     : 'border-white/10 hover:border-white/20'
//                 }`}
//               >
//                 <div
//                   className={`absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
//                     tool.highlight
//                       ? 'from-purple-600/10 via-purple-400/5 to-transparent'
//                       : 'from-white/5 via-white/2 to-transparent'
//                   }`}
//                 />

//                 <div className="relative">
//                   <div className="text-purple-400 mb-4">{tool.icon}</div>
//                   <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
//                     {tool.title}
//                     <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
//                   </h3>
//                   <p className="text-sm text-gray-400 mb-4">{tool.description}</p>

//                   <div className="flex items-center gap-2 text-sm">
//                     <Timer className="w-4 h-4 text-purple-400" />
//                     <span className="text-purple-200">{tool.stats}</span>
//                   </div>
//                 </div>
//               </button>
//             ))}
//           </div>

//           {/* CTA Section */}
//           <div className="text-center mt-20">
//             <h2 className="text-3xl font-bold mb-6">Start Saving Time Today</h2>
//             <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
//               Join thousands of e-commerce sellers who are using AI to automate their workflow and
//               increase sales.
//             </p>
//             <button
//               onClick={() => navigate('/video')}
//               className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl font-semibold hover:from-purple-500 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 mx-auto"
//             >
//               <Sparkles className="w-5 h-5" />
//               Try Our Tools Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LandingPage;