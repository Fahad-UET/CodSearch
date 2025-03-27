import { Download, ExternalLink, Link2 } from 'lucide-react';
import React from 'react'

type ImageProps = {
    outputUrl: string;
    title: string;
    imageLoading: boolean;
}

const ImageContainer = ({ outputUrl, title, imageLoading }: ImageProps) => {
    const handleDownload = (e: React.MouseEvent, url: string) => {
        e.stopPropagation();
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = url.split('/').pop() || 'download';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(blobUrl);
            })
            .catch(err => console.error('Download failed:', err));
    };

    return (
        <div className="grid grid-cols-12 gap-6">
            {
                imageLoading ? 
                <div className='col-span-12 flex justify-center items-center flex-col'> 
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto">
                    </div>
                    Image Loading
                </div>
                :
                <div className="card overflow-hidden col-span-9">
                    <div className="aspect-square bg-[#1A1A3A]/30">
                        <img
                            src={outputUrl}
                            alt="Retouched Result"
                            className="w-full h-full object-cover bg-[#1A1A3A]/30"
                            onError={e => {
                                const img = e.currentTarget;
                                img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.2)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E`;
                                img.classList.add('p-12', 'opacity-50');
                            }}
                        />
                    </div>
                    <div className="p-4 border-t border-white/10">
                        <h3 className="text-lg font-medium mb-2">{title}</h3>
                        <div className="flex justify-center gap-[5px]">
                            <button
                                onClick={(e: React.MouseEvent) => handleDownload(e, outputUrl)}
                                className="flex items-center gap-1 px-3 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors text-sm"
                                title="Download image"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                            <a
                                href={outputUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-3 py-2 bg-[#1A1A3A]/30 hover:bg-[#2A1A4A]/30 rounded-lg text-white/90 transition-colors text-sm"
                                title="Open in new tab"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Open
                            </a>
                            <button
                                onClick={() => navigator.clipboard.writeText(outputUrl)}
                                className="flex items-center gap-1 px-3 py-2 bg-[#1A1A3A]/30 hover:bg-[#2A1A4A]/30 rounded-lg text-white/90 transition-colors text-sm text-nowrap"
                                title="Copy image URL"
                            >
                                <Link2 className="w-4 h-4" />
                                Copy URL
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ImageContainer