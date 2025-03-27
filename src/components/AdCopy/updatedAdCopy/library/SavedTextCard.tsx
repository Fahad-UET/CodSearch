import React from 'react';
import {
  Copy,
  Trash2,
  ChevronDown,
  PenLine,
  Save,
  X,
  Tag as TagIcon,
  Download,
} from 'lucide-react';
import { DEFAULT_TAGS } from '../../../../types/tags';
import { useSavedTextsStore } from '@/store/savedTextStore';
import { useEditorStore } from '@/store/editorStore';
// import type { SavedText } from '../../context/SavedTextsContext';
// import { useSavedTexts, useEditorContext } from '../../context/SavedTextsContext';

interface Props {
  text: any;
  onDelete: (id: string) => void;
  onCopy: (content: string) => void;
  showTagMenu: {
    status: boolean;
    index: number;
  };
  setShowTagMenu: (per: any) => void;
  ind: number;
  setActiveTab: (id: string) => void;
}

export default function SavedTextCard({
  setActiveTab,
  showTagMenu,
  setShowTagMenu,
  text,
  onDelete,
  onCopy,
  ind,
}: Props) {
  const [expanded, setExpanded] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(text?.content || text?.title);
  const contentRef = React.useRef<HTMLParagraphElement>(null);
  const [isContentTruncated, setIsContentTruncated] = React.useState(false);
  const { updateText, updateTags, setActiveText } = useSavedTextsStore();
  const { setEditorContent } = useEditorStore();

  const [isDownloading, setIsDownloading] = React.useState(false);

  React.useEffect(() => {
    const checkTruncation = () => {
      if (contentRef.current) {
        setIsContentTruncated(contentRef.current.scrollHeight > contentRef.current.clientHeight);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [text?.content || text?.title]);

  const flagEmoji = {
    ar: '🇸🇦',
    en: '🇺🇸',
    fr: '🇫🇷',
    es: '🇪🇸',
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateText(text.id, editedContent);
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedContent(text?.content || text?.title);
    setIsEditing(false);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const blob = new Blob([text?.content || text?.title], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `text-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      onClick={() => !isEditing && setExpanded(!expanded)}
      className={`group bg-white rounded-lg overflow-hidden border border-gray-200 
        hover:border-[#5D1C83]/20 transition-all duration-300 ${isEditing ? '' : 'cursor-pointer'}`}
      dir={text.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between flex-row-reverse">
          <span className="text-sm text-gray-500">{text.date}</span>
          <div className="flex items-center gap-1 flex-row-reverse">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 z-10 flex items-center gap-1 flex-row-reverse"
                  title="Save changes"
                >
                  <Save className="w-4 h-4" />
                  <span className="text-sm">Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-lg transition-all duration-200 z-10 flex items-center gap-1 flex-row-reverse"
                  title="Cancel editing"
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm">Cancel</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1 flex-row-reverse">
                <div className="relative">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setShowTagMenu({
                        index: ind,
                        status: !showTagMenu.status,
                      });
                    }}
                    className="p-1.5 text-gray-500 hover:text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-all duration-200 z-10"
                    title="Manage tags"
                  >
                    <TagIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDownload();
                    }}
                    className="p-1.5 text-gray-500 hover:text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-all duration-200 z-10"
                    title="Download text"
                    disabled={isDownloading}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={async e => {
                    e.stopPropagation();
                    setActiveTab('editor');
                    setActiveText(text);
                    setEditorContent(text?.content || text?.title);
                    // Find the keyboard tab button and click it
                    const keyboardTab = document.querySelector('[data-tab="keyboard"]');
                    if (keyboardTab instanceof HTMLElement) {
                      keyboardTab.click();
                    }
                  }}
                  className="p-1.5 text-gray-500 hover:text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-all duration-200 z-10"
                  title="Edit text"
                >
                  <PenLine className="w-4 h-4" />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onCopy(text?.content || text?.title);
                  }}
                  className="p-1.5 text-gray-500 hover:text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-all duration-200 z-10"
                  title="Copy text"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onDelete(text.id);
                  }}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 z-10"
                  title="Delete text"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={e => setEditedContent(e.target.value)}
            className={`w-full p-2 text-gray-800 leading-relaxed whitespace-pre-wrap border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] transition-all duration-300 min-h-[120px] resize-none ${
              text.language === 'ar' ? 'text-right' : 'text-left'
            }`}
            dir={text.language === 'ar' ? 'rtl' : 'ltr'}
            onClick={e => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <div className="relative">
            <p
              ref={contentRef}
              className={`text-gray-700 transition-all duration-300 font-semibold text-xl ${
                text.usedInPrompt ? 'text-white/40' : 'text-gray-700'
              } ${expanded ? 'whitespace-pre-wrap' : 'truncate'}`}
            >
              {text?.content || text?.title}
            </p>

            {isContentTruncated && (
              <div className="mt-1 text-xs text-gray-500">
                {expanded ? 'Click to collapse' : 'Click to expand'}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {text.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {text.tags.map(tagId => {
              const tag = DEFAULT_TAGS.find(t => t.id === tagId);
              if (!tag) return null;
              return (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                  }}
                >
                  {tag.name}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
