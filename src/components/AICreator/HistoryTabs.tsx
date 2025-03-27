import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Image,
  Video,
  MessageSquare,
  Music,
  Download,
  ExternalLink,
  Link2,
  X,
  Check,
  ArrowLeft,
  Copy,
  FileText,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { useHistory, type HistoryItem } from '@/store/history';

interface HistoryTabsProps {
  onItemClick?: (item: HistoryItem) => void;
  defaultTab?: 'image' | 'video' | 'text' | 'audio';
  setPrompt?: (prompt: string) => void;
}

function HistoryTabs({ onItemClick, defaultTab = 'image', setPrompt }: HistoryTabsProps) {
  const [activeTab, setActiveTab] = React.useState<'image' | 'video' | 'text' | 'audio'>(
    defaultTab
  );
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const { items, clearHistory, removeItem } = useHistory();
  const [activeElement, setActiveElement] = React.useState<HTMLElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      const isButton = target && target.tagName === 'BUTTON' && target.title === 'Insert prompt';
      if (!isButton && target instanceof HTMLElement) {
        setActiveElement(target);
      }
    };

    const handleBlur = () => {
      if (document.activeElement instanceof HTMLElement) {
        setTimeout(() => setActiveElement(document.activeElement as HTMLElement), 0);
      }
    };

    document.addEventListener('focusin', handleFocus);
    // document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      // document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  const handleInsert = (e: React.MouseEvent, content: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (
      activeElement &&
      (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)
    ) {
      const start = activeElement.selectionStart || 0;
      const end = activeElement.selectionEnd || 0;
      const value = activeElement.value;
      const newValue = value.substring(0, start) + content + value.substring(end);

      // Create and dispatch an input event
      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertText',
        data: content,
      });

      // Set the value and dispatch the event
      activeElement.value = newValue;
      activeElement.dispatchEvent(inputEvent);

      // Restore focus and selection
      activeElement.focus();
      activeElement.setSelectionRange(start + content.length, start + content.length);
    }
  };

  const handleInsertText = (e: React.MouseEvent, content: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (
      activeElement &&
      (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)
    ) {
      const start = activeElement.selectionStart || 0;
      const end = activeElement.selectionEnd || 0;
      const value = activeElement.value;
      const newValue = value.substring(0, start) + content + value.substring(end);
      setPrompt(newValue)
      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertText',
        data: content,
      });
      activeElement.dispatchEvent(inputEvent);
      activeElement.focus();
      activeElement.setSelectionRange(start + content.length, start + content.length);
    }
  };

  const handleDelete = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    removeItem(itemId);
  };

  const handleUseLipSync = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
  
    if (item.content.audioUrl) {
      // Store the audio URL in sessionStorage
      sessionStorage.setItem('lipSyncAudio', item.content.audioUrl);
      // Navigate to lip sync page
      navigate('/lipsync');
    }
  };

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

  const handleDownloadText = (e: React.MouseEvent, content: string) => {
    e.stopPropagation();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-response-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = (e: React.MouseEvent, content: string) => {
    e.stopPropagation();
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('AI Generated Response', 20, 20);

    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

    // Add content
    doc.setFontSize(12);
    doc.text('Response:', 20, 40);

    // Split text into lines that fit the page width
    const splitResponse = doc.splitTextToSize(content, 170);
    doc.text(splitResponse, 20, 50);

    // Save the PDF
    doc.save(`ai-response-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleCopy = async (e: React.MouseEvent, url: string, itemId: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(itemId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleOpenTab = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  const handleItemClick = (item: HistoryItem) => {
    // Call the original onItemClick handler
    onItemClick?.(item);
  };

  const tabs = [
    { id: 'image', label: 'Images', icon: <Image className="w-4 h-4" /> },
    { id: 'video', label: 'Videos', icon: <Video className="w-4 h-4" /> },
    { id: 'audio', label: 'Audio', icon: <Music className="w-4 h-4" /> },
    { id: 'text', label: 'Text', icon: <MessageSquare className="w-4 h-4" /> },
  ] as const;

  const filteredItems = items
    .filter(item => {
      if (
        activeTab === 'audio' &&
        (item.type === 'text-to-speech' || item.type === 'video-to-audio')
      ) {
        return item;
      } else if (
        activeTab === 'text' &&
        (item.type === 'prompt' ||
          item.type === 'text' ||
          item.type === 'image-to-text' ||
          item.type === 'transcribe')
      ) {
        return item;
      } else if (
        activeTab === 'image' &&
        (item.type === 'image' ||
          item.type === 'image-upscaler' ||
          item.type === 'change-image-background' ||
          item.type === 'face-retoucher' ||
          item.type === 'image-watermark-remover' ||
          item.type === 'face-swap' ||
          item.type === 'outfits-image' ||
          item.type === 'product-image' ||
          item.type === 'product-variations' ||
          item.type === 'remove-image-background' ||
          item.type === 'text-to-image' ||
          item.type === 'product-replace')
      ) {
        return item;
      } else if (
        activeTab === 'video' &&
        (item.type === 'video' ||
          item.type === 'lipsync' ||
          item.type === 'veo2' ||
          item.type === 'video-background-remover' ||
          item.type === 'video-watermark-remover' ||
          item.type === 'outfits-video' ||
          item.type === 'product-video' ||
          item.type === 'video-upscaler')
      ) {
        return item;
      }
    })
    .slice(0, 50);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex flex-1 rounded-lg bg-white/5 p-1 justify-center">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center w-12 h-12 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#4A2A7A] text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              title={tab.label}
            >
              <div className="w-5 h-5">{tab.icon}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => navigate(`/${item.type}?id=${item.id}`)}
              className="card p-4 cursor-pointer hover:bg-white/10 transition-colors animate-fade-in"
            >
              {(item.type === 'prompt' ||
                item.type === 'text' ||
                item.type === 'image-to-text' ||
                item.type === 'transcribe') && (
                <div className="space-y-4">
                  <p className="text-white/90 line-clamp-4">{item.content.response}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={e =>  handleInsertText(e, item.content.response || '')}
                      className={`p-2 transition-colors rounded-md flex items-center gap-1 ${
                        activeElement
                          ? 'text-white/60 hover:text-white hover:bg-white/5'
                          : 'text-white/20 cursor-not-allowed'
                      }`}
                      title="Insert prompt"
                      disabled={!activeElement}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-xs">Insert</span>
                    </button>
                    <button
                      onClick={e => handleDownloadText(e, item.content.response || '')}
                      className="p-2 text-white/40 hover:text-white/60 transition-colors rounded-md hover:bg-white/5"
                      title="Download as text file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={e => handleDownloadPdf(e, item.content.response || '')}
                      className="p-2 text-white/40 hover:text-white/60 transition-colors rounded-md hover:bg-white/5"
                      title="Download as PDF"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={e => handleCopy(e, item.content.response || '', item.id)}
                      className="p-2 text-white/40 hover:text-white/60 transition-colors rounded-md hover:bg-white/5"
                      title={copiedId === item.id ? 'Copied!' : 'Copy response'}
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={e => handleDelete(e, item.id)}
                      className="p-2 text-white/40 hover:text-red-400 transition-colors rounded-md hover:bg-white/5"
                      title="Delete"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              {(item.type === "text-to-speech" || item.type === 'video-to-audio') && (
                <div className="space-y-4">
                  <audio src={item.content.audioUrl} controls className="w-full" />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => handleUseLipSync(e, item)}
                      className={`p-2 transition-colors rounded-md flex items-center gap-1 ${
                        activeElement
                          ? 'text-white/60 hover:text-white hover:bg-white/5'
                          : 'text-white/20 cursor-not-allowed'
                      }`}
                      title="Insert URL"
                      disabled={!activeElement}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-xs">Use in Lip Sync</span>
                    </button>
                    <button
                      onClick={e => handleDownload(e, item.content.audioUrl || '')}
                      className="p-2 text-white/40 hover:text-white/60 transition-colors rounded-md hover:bg-white/5"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={e => handleOpenTab(e, item.content.audioUrl || '')}
                      className="p-2 text-white/40 hover:text-white/60 transition-colors rounded-md hover:bg-white/5"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={e => handleCopy(e, item.content.audioUrl || '', item.id)}
                      className="p-2 text-white/40 hover:text-white/60 transition-colors rounded-md hover:bg-white/5"
                      title={copiedId === item.id ? 'Copied!' : 'Copy URL'}
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Link2 className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={e => handleDelete(e, item.id)}
                      className="p-2 text-white/40 hover:text-red-400 transition-colors rounded-md hover:bg-white/5"
                      title="Delete"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              {(item.type === 'image' ||
                item.type === 'image-upscaler' ||
                item.type === 'change-image-background' ||
                item.type === 'face-retoucher' ||
                item.type === 'image-watermark-remover' ||
                item.type === 'face-swap' ||
                item.type === 'outfits-image' ||
                item.type === 'product-image' ||
                item.type === 'product-variations' ||
                item.type === 'remove-image-background' ||
                item.type === 'text-to-image' ||
                item.type === 'product-replace') &&
                item.content.imageUrl && (
                  <div className="space-y-4">
                    <div key={index} className="card overflow-hidden">
                      <img
                        src={item.content.imageUrl}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-auto aspect-square object-cover bg-white/5"
                        loading="lazy"
                        onError={e => {
                          const img = e.currentTarget;
                          img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.2)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E`;
                          img.classList.add('p-12', 'opacity-50');
                        }}
                      />
                      <div className="p-4 border-t border-white/10 flex justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()            
                           sessionStorage.setItem('imageToVideo', item.content.imageUrl );
                           navigate('/video');
                         }}
                          className={`p-2 transition-colors rounded-md flex items-center gap-1 ${
                            activeElement
                              ? 'text-white/60 hover:text-white hover:bg-white/5'
                              : 'text-white/20 cursor-not-allowed'
                          }`}
                          title="Insert URL"
                          disabled={!activeElement}
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span className="text-xs">Use To Video</span>
                        </button>
                        <button
                          onClick={e => handleDownload(e, item.content.imageUrl || '')}
                          className="p-2 text-white/40 hover:text-white/60 transition-colors rounded-md hover:bg-white/5"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={e => handleOpenTab(e, item.content.imageUrl || '')}
                          className="p-2 text-white/40 hover:text-white/60 transition-colors rounded-md hover:bg-white/5"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={e => handleCopy(e, item.content.imageUrl || '', item.id)}
                          className="p-2 text-white/40 hover:text-white/60 transition-colors rounded-md hover:bg-white/5"
                          title={copiedId === item.id ? 'Copied!' : 'Copy URL'}
                        >
                          {copiedId === item.id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Link2 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={e => handleDelete(e, item.id)}
                          className="p-2 text-white/40 hover:text-red-400 transition-colors rounded-md hover:bg-white/5"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-white/40 px-4 pb-4">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              {(item.type === 'video' ||
                item.type === 'lipsync' ||
                item.type === 'veo2' ||
                item.type === 'video-background-remover' ||
                item.type === 'video-watermark-remover' ||
                item.type === 'outfits-video' ||
                item.type === 'product-video' ||
                item.type === 'video-upscaler') &&
                item.content.videoUrl && (
                  <div className="space-y-4">
                    <video
                      src={item.content.videoUrl}
                      className="w-full h-full"
                      loop
                      muted
                      onMouseEnter={e => e.currentTarget.play()}
                      onMouseLeave={e => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={e => handleInsert(e, item.content.videoUrl || '')}
                        className={`p-2 transition-colors rounded-md flex items-center gap-1 ${
                          activeElement
                            ? 'text-white/60 hover:text-white hover:bg-white/5'
                            : 'text-white/20 cursor-not-allowed'
                        }`}
                        title="Insert URL"
                        disabled={!activeElement}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-xs">Insert</span>
                      </button>
                      <button
                        onClick={e => handleDownload(e, item.content.videoUrl || '')}
                        className="p-2 text-white/40 hover:text-white/60 transition-colors rounded-md hover:bg-white/5"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={e => handleOpenTab(e, item.content.videoUrl || '')}
                        className="p-2 text-white/40 hover:text-white/60 transition-colors rounded-md hover:bg-white/5"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={e => handleCopy(e, item.content.videoUrl || '', item.id)}
                        className="p-2 text-white/40 hover:text-white/60 transition-colors rounded-md hover:bg-white/5"
                        title={copiedId === item.id ? 'Copied!' : 'Copy URL'}
                      >
                        {copiedId === item.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Link2 className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={e => handleDelete(e, item.id)}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors rounded-md hover:bg-white/5"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              <p className="text-xs text-white/40 mt-4">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-white/40 mt-8 p-8 border border-white/5 rounded-lg">
            <p>No {activeTab} history yet</p>
            <p className="text-sm mt-2">Generated {activeTab}s will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryTabs;
