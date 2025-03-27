import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Download, Copy, Save, PlusCircle, MessageSquarePlus, Split, BookmarkCheck, FolderPlus, Pencil, X, Trash2, Check, Star, Sparkles, Bookmark } from 'lucide-react';
import { sendMessage } from './utils/api';
import { AVAILABLE_MODELS, AVAILABLE_LANGUAGES, type Message, type Language, type SavedSelection, type SelectionCollection, type SavedPrompt } from './utils/Types';
import { Header } from './Header';
import { ChatInput } from './ChatInput';
import { LoadingIndicator } from './LoadingIndicator';
import { SelectedModels } from './SelectedModels';
import { linkify } from './utils/linkify';

const DEFAULT_MODEL_KEY = 'defaultModel';

function index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('default');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>(() => {
    const savedModel = localStorage.getItem(DEFAULT_MODEL_KEY);
    return savedModel ? [savedModel] : ["openai/gpt-4o-mini"];
  });
  const [isModelPanelOpen, setIsModelPanelOpen] = useState(false);
  const [activeResponseGroup, setActiveResponseGroup] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
    return localStorage.getItem('defaultLanguage') as Language || 'en';
  });
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<Message[]>([]);
  const [comparedResponses, setComparedResponses] = useState<Array<{
    content: string;
    model: string;
  }> | null>(null);
  const [collections, setCollections] = useState<SelectionCollection[]>([{
    id: 'default',
    name: 'Default Collection',
    timestamp: Date.now()
  }]);
  const [savedSelections, setSavedSelections] = useState<SavedSelection[]>([]);
  const [editingCollection, setEditingCollection] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isMemoryPanelOpen, setIsMemoryPanelOpen] = useState(false);
  const [isPromptPanelOpen, setIsPromptPanelOpen] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [editingPrompt, setEditingPrompt] = useState<SavedPrompt | null>(null);
  const [newPromptTitle, setNewPromptTitle] = useState('');
  const [newPromptContent, setNewPromptContent] = useState('');
  const [newPromptShortcut, setNewPromptShortcut] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const modelPanelRef = useRef<HTMLDivElement>(null);

  const clearChat = () => {
    setMessages([]);
    setInput('');
    setSelectedImage(null);
  };

  const [actionFeedback, setActionFeedback] = useState<{
    type: string;
    id: string;
    message: string;
  } | null>(null);

  const showActionFeedback = (type: string, id: string, message: string) => {
    setActionFeedback({ type, id, message });
    setTimeout(() => setActionFeedback(null), 1500);
  };

  const downloadText = (text: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'response.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showActionFeedback('download', 'download-feedback', 'Downloaded successfully');
  };

  const copyText = async (text: string, id: string = 'copy-feedback') => {
    await navigator.clipboard.writeText(text);
    showActionFeedback('copy', id, 'Copied to clipboard');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelPanelRef.current && !modelPanelRef.current.contains(event.target as Node)) {
        setIsModelPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setSelectionPosition(null);
        return;
      }
      
      const text = selection.toString().trim();
      if (!text) {
        setSelectionPosition(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectionPosition({
        x: rect.x + rect.width,
        y: rect.y - 40
      });
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if Ctrl/Cmd + Alt is pressed
      if ((e.ctrlKey || e.metaKey) && e.altKey) {
        const key = e.key.toLowerCase();
        const prompt = savedPrompts.find(p => p.shortcut?.toLowerCase() === key);
        if (prompt) {
          e.preventDefault();
          usePrompt(prompt.content);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [savedPrompts]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const reuseAsPrompt = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const toggleResponseForComparison = (response: Message) => {
    setSelectedForComparison(prev => {
      const index = prev.findIndex(r => r.model === response.model);
      if (index !== -1) {
        // Remove if already selected
        return prev.filter((_, i) => i !== index);
      }
      if (prev.length >= 3) {
        // Remove oldest if already have 3
        return [...prev.slice(1), response];
      }
      return [...prev, response];
    });
  };

  const startComparison = () => {
    if (selectedForComparison.length > 1) {
      setComparisonMode(true);
      setComparedResponses(
        selectedForComparison.map(response => ({
          content: response.content,
          model: AVAILABLE_MODELS.find(m => m.id === response.model)?.name || 'AI'
        }))
      );
      setSelectedForComparison([]);
    }
  };

  const closeComparison = () => {
    setComparisonMode(false);
    setComparedResponses(null);
    setSelectedForComparison([]);
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const text = selection.toString().trim();
    if (!text) return;

    const newSelection: SavedSelection = {
      id: crypto.randomUUID(),
      text,
      timestamp: Date.now(),
      source: 'Chat Response',
      collectionId: selectedCollectionId
    };

    // Add the new selection to the state
    setSavedSelections(prev => [...prev, newSelection]);
    
    // Only hide the save button
    setSelectionPosition(null);
  };

  const createNewCollection = () => {
    const newCollection: SelectionCollection = {
      id: crypto.randomUUID(),
      name: newCollectionName || 'New Collection',
      timestamp: Date.now()
    };
    setCollections(prev => [...prev, newCollection]);
    setNewCollectionName('');
  };

  const renameCollection = (collectionId: string, newName: string) => {
    setCollections(prev => prev.map(c => 
      c.id === collectionId ? { ...c, name: newName } : c
    ));
    setEditingCollection(null);
  };

  const deleteCollection = (collectionId: string) => {
    setCollections(prev => prev.filter(c => c.id !== collectionId));
    setSavedSelections(prev => prev.filter(s => s.collectionId !== collectionId));
  };

  const groupSelectionsByDate = (selections: SavedSelection[]) => {
    const groups: { [key: string]: SavedSelection[] } = {};
    selections.forEach(selection => {
      const date = new Date(selection.timestamp).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(selection);
    });
    return groups;
  };

  const downloadAllSelections = () => {
    const text = savedSelections.filter(s => s.collectionId === selectedCollectionId)
      .map(s => s.text)
      .join('---\n\n');
    downloadText(text);
  };

  const copyAllSelections = async () => {
    const text = savedSelections
      .map(s => s.text)
      .join('\n\n---\n\n');
    await copyText(text);
  };

  const removeSelection = (id: string) => {
    setSavedSelections(prev => prev.filter(s => s.id !== id));
  };

  const createNewPrompt = () => {
    if (!newPromptTitle.trim() || !newPromptContent.trim() || !newPromptShortcut.trim()) return;
    
    const newPrompt: SavedPrompt = {
      id: crypto.randomUUID(),
      title: newPromptTitle,
      content: newPromptContent,
      timestamp: Date.now(),
      shortcut: newPromptShortcut
    };
    
    setSavedPrompts(prev => [...prev, newPrompt]);
    setNewPromptTitle('');
    setNewPromptContent('');
    setNewPromptShortcut('');
  };

  const updatePrompt = (prompt: SavedPrompt) => {
    setSavedPrompts(prev => prev.map(p => 
      p.id === prompt.id ? prompt : p
    ));
    setEditingPrompt(null);
  };

  const deletePrompt = (id: string) => {
    setSavedPrompts(prev => prev.filter(p => p.id !== id));
  };

  const usePrompt = (content: string) => {
    setInput(content);
    setIsPromptPanelOpen(false);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;
    
    // Early validation for image support
    if (selectedImage) {
      const unsupportedModels = selectedModels
        .map(id => AVAILABLE_MODELS.find(m => m.id === id))
        .filter(model => model && !model.supportsImages)
        .map(model => model?.name)
        .filter(Boolean);
      
      if (unsupportedModels.length > 0) {        
        const supportedModels = selectedModels
          .map(id => AVAILABLE_MODELS.find(m => m.id === id))
          .filter(model => model?.supportsImages)
          .map(model => model?.name)
          .filter(Boolean);
        
        const errorMessages = {
          fr: {
            title: "Modèles incompatibles avec les images",
            models: `Les modèles suivants ne prennent pas en charge les images : ${unsupportedModels.join(', ')}`,
            options: [
              supportedModels.length > 0 
                ? `Supprimer ces modèles et utiliser uniquement : ${supportedModels.join(', ')}`
                : "Aucun modèle sélectionné ne prend en charge les images",
              "Ou supprimer l'image pour continuer avec tous les modèles"
            ]
          },
          ar: {
            title: "نماذج لا تدعم الصور",
            models: `النماذج التالية لا تدعم الصور: ${unsupportedModels.join('، ')}`,
            options: [
              supportedModels.length > 0 
                ? `إزالة هذه النماذج واستخدام: ${supportedModels.join('، ')}`
                : "لا يوجد نموذج محدد يدعم الصور",
              "أو إزالة الصورة للمتابعة مع جميع النماذج"
            ]
          },
          es: {
            title: "Modelos incompatibles con imágenes",
            models: `Los siguientes modelos no admiten imágenes: ${unsupportedModels.join(', ')}`,
            options: [
              supportedModels.length > 0 
                ? `Elimine estos modelos y use solo: ${supportedModels.join(', ')}`
                : "Ningún modelo seleccionado admite imágenes",
              "O elimine la imagen para continuar con todos los modelos"
            ]
          },
          en: {
            title: "Models incompatible with images",
            models: `The following models don't support images: ${unsupportedModels.join(', ')}`,
            options: [
              supportedModels.length > 0 
                ? `Remove these models and use only: ${supportedModels.join(', ')}`
                : "No selected model supports images",
              "Or remove the image to continue with all models"
            ]
          }
        };
        
        const msg = errorMessages[selectedLanguage] || errorMessages.en;
        const formattedError = `<div class="text-red-600 font-medium">**${msg.title}**</div>\n\n${msg.models}\n\n${msg.options.join('\n')}`;
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: formattedError,
          model: 'system',
          metadata: { language_used: selectedLanguage }
        }]);
        setSelectedImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
    }

    const currentLanguage = selectedLanguage || 'en';
    
    // Create a copy of current messages for the API call
    const currentMessages = [...messages];

    const userMessage = {
      role: 'user' as const,
      content: input,
      image: selectedImage || undefined,
    };
    
    // Add the new user message to the UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsLoading(true);

    try {
      // Use currentMessages to include all previous messages in the API call
      const responses = await sendMessage([...currentMessages, userMessage], selectedModels, currentLanguage);
      const assistantMessages = responses.map(response => ({
        role: 'assistant' as const,
        content: response.content || 'No response received',
        model: response.model,
        metadata: response.metadata
      }));
      // Add all assistant responses to the messages state
      setMessages(prev => [...prev, ...assistantMessages]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response';
      const errorMessages = {
        fr: {
          title: "Erreur",
          message: errorMessage
        },
        ar: {
          title: "خطأ",
          message: errorMessage
        },
        es: {
          title: "Error",
          message: errorMessage
        },
        en: {
          title: "Error",
          message: errorMessage
        }
      };
      
      const msg = errorMessages[selectedLanguage] || errorMessages.en;
      const formattedError = `<div class="text-red-600 font-medium">**${msg.title}**</div>\n\n${msg.message}`;
      
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: formattedError,
        model: 'system',
        metadata: { language_used: currentLanguage }
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModel = (modelId: string) => {
    setSelectedModels(prev => {
      if (prev.includes(modelId)) {
        // Don't allow deselecting if it's the last model
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== modelId);
      }
      return [...prev, modelId];
    });
  };

  const setDefaultModel = (modelId: string) => {
    localStorage.setItem(DEFAULT_MODEL_KEY, modelId);
    showActionFeedback('default', `default-${modelId}`, 'Set as default model');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900">
      <div className="w-full flex flex-col h-screen">
        <Header
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          savedSelectionsCount={savedSelections.length}
          setIsMemoryPanelOpen={setIsMemoryPanelOpen}
          setDefaultLanguage={setSelectedLanguage}
          selectedModels={selectedModels}
          toggleModel={toggleModel}
        />
        <SelectedModels
          selectedModels={selectedModels}
          toggleModel={toggleModel}
        />

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.reduce((groups: Message[][], message, index) => {
            if (message.role === 'user') {
              groups.push([message]);
            } else if (groups.length > 0) {
              groups[groups.length - 1].push(message);
            }
            return groups;
          }, []).map((group, groupIndex) => {
            const userMessage = group[0];
            const assistantResponses = group.slice(1);
            
            return (
              <div key={groupIndex} className="max-w-7xl mx-auto space-y-4">
                {/* User Message */}
                <div className="flex justify-end items-start gap-3">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-4 max-w-[80%] shadow-lg">
                    {userMessage.image && (
                      <div className="mb-2">
                        <img src={userMessage.image} alt="User uploaded" className="max-w-full rounded-lg" />
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{userMessage.content}</p>
                  </div>
                  <User className="w-8 h-8 p-1 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg" />
                </div>

                {/* AI Responses */}
                {assistantResponses.length > 0 && (
                  <div className="relative">
                    <div className="flex items-center mb-2">
                      <Bot className="w-8 h-8 p-1 glass-effect text-white rounded-lg mr-2" />
                      <span className="text-white text-sm">AI Responses</span>
                    </div>
                    <div className="glass-effect rounded-lg shadow-lg overflow-hidden border border-white/10">
                      {/* Response Tabs */}
                      <div className="flex border-b border-white/10 bg-black/20">
                        {selectedModels.map((modelId, tabIndex) => {
                          const response = assistantResponses.find(r => r.model === modelId);
                          const modelName = AVAILABLE_MODELS.find(m => m.id === modelId)?.name || 'AI';
                          return (
                            <button
                              key={modelId}
                              onClick={() => setActiveResponseGroup(tabIndex)}
                              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                                tabIndex === activeResponseGroup
                                  ? 'border-white text-white bg-white/10'
                                  : 'border-transparent text-white/70 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              {modelName}
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Response Content */}
                      <div className="p-6 text-white">
                        {selectedModels.map((modelId, tabIndex) => {
                          const response = assistantResponses.find(r => r.model === modelId);
                          return (
                            <div
                              key={modelId}
                              className={`transition-all duration-200 ${
                                tabIndex === activeResponseGroup ? 'block' : 'hidden'
                              }`}
                            >
                              {response ? (
                                <>
                                  <div className={`${selectedLanguage === 'ar' ? 'text-right' : 'text-left'} relative`}>
                                    <p 
                                      className={`whitespace-pre-wrap ${selectedLanguage === 'ar' ? 'arabic-text' : ''} leading-relaxed`}
                                      dangerouslySetInnerHTML={{ 
                                        __html: linkify(response.content)
                                      }}
                                    />
                                  </div>
                                  <div className="flex gap-2 mt-3 justify-end">
                                    {response.metadata?.input_tokens !== undefined && response.metadata?.output_tokens !== undefined && (
                                      <div className="flex-1 text-sm text-gray-500 flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                          <span className="font-mono glass-effect text-white/90 px-2 py-0.5 rounded">
                                            {response.metadata.input_tokens + response.metadata.output_tokens}
                                          </span>
                                          Tokens
                                        </span>
                                        {(() => {
                                          const model = AVAILABLE_MODELS.find(m => m.id === response.model);
                                          if (!model) return null;
                                          const totalTokens = response.metadata.input_tokens + response.metadata.output_tokens;
                                          const credits = (totalTokens / 1000) * model.creditsPerThousandTokens;
                                          return (
                                            <span className="flex items-center gap-1">
                                              <span className="font-mono glass-effect text-white/90 px-2 py-0.5 rounded">
                                                {credits.toFixed(2)}
                                              </span>
                                              Credits
                                            </span>
                                          );
                                        })()}
                                      </div>
                                    )}
                                    <button
                                      onClick={() => copyText(response.content, `copy-${response.model}`)}
                                      className="p-2 text-white/80 hover:text-white relative group"
                                      title="Copy to clipboard"
                                    >
                                      <Copy className={`w-6 h-6 ${
                                        actionFeedback?.type === 'copy' && 
                                        actionFeedback?.id === `copy-${response.model}` ? 
                                        'success-animation' : ''
                                      }`} />
                                      {actionFeedback?.type === 'copy' && 
                                       actionFeedback?.id === `copy-${response.model}` && (
                                        <span className="success-message absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                          <Check className="w-3 h-3 inline-block mr-1" />
                                          {actionFeedback.message}
                                        </span>
                                      )}
                                    </button>
                                    <button
                                      onClick={() => downloadText(response.content)}
                                      className="p-2 text-white/80 hover:text-white relative group"
                                      title="Download as text file"
                                    >
                                      <Download className={`w-6 h-6 ${
                                        actionFeedback?.type === 'download' ? 'success-animation' : ''
                                      }`} />
                                      {actionFeedback?.type === 'download' && (
                                        <span className="success-message absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                          <Check className="w-3 h-3 inline-block mr-1" />
                                          {actionFeedback.message}
                                        </span>
                                      )}
                                    </button>
                                    <button
                                     onClick={() => {
                                       const newSelection: SavedSelection = {
                                         id: crypto.randomUUID(),
                                         text: response.content,
                                         timestamp: Date.now(),
                                        source: `${AVAILABLE_MODELS.find(m => m.id === response.model)?.name || 'AI'} Response`,
                                        collectionId: selectedCollectionId
                                       };
                                       setSavedSelections(prev => [...prev, newSelection]);
                                       showActionFeedback('save', `save-${response.model}`, 'Saved successfully');
                                     }}
                                      className="p-2 text-white/80 hover:text-white relative group"
                                      title="Save response"
                                    >
                                      <Save className={`w-6 h-6 ${
                                        actionFeedback?.type === 'save' && 
                                        actionFeedback?.id === `save-${response.model}` ? 
                                        'success-animation' : ''
                                      }`} />
                                      {actionFeedback?.type === 'save' && 
                                       actionFeedback?.id === `save-${response.model}` && (
                                        <span className="success-message absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                          <Check className="w-3 h-3 inline-block mr-1" />
                                          {actionFeedback.message}
                                        </span>
                                      )}
                                    </button>
                                    <button
                                      onClick={() => reuseAsPrompt(response.content)}
                                      className="p-2 text-white/80 hover:text-white"
                                      title="Use as prompt"
                                    >
                                      <MessageSquarePlus className="w-6 h-6" />
                                    </button>
                                    {response && (
                                      <div className="flex items-center">
                                      <button
                                        onClick={() => toggleResponseForComparison(response)}
                                        className={`p-1 flex items-center gap-1 ${
                                          selectedForComparison.some(r => r.model === response.model)
                                            ? 'text-white bg-white/10 rounded'
                                            : 'text-white/80 hover:text-white'
                                        }`}
                                        title="Compare responses"
                                      >
                                        <span className="text-xs font-bold">
                                          {selectedForComparison.findIndex(r => r.model === response.model) + 1 || 'Compare'}
                                        </span>
                                      </button>
                                      {selectedForComparison.length > 1 && selectedForComparison.some(r => r.model === response.model) && (
                                        <button
                                          onClick={startComparison}
                                          className="p-2 text-white/80 hover:text-white"
                                          title="Start comparison"
                                        >
                                          <Split className="w-6 h-6" />
                                        </button>
                                      )}
                                      </div>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <p className="text-gray-500 italic">No response from this model</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {isLoading && (
            <LoadingIndicator selectedModels={selectedModels} />
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Floating Save Button */}
        {selectionPosition && (
          <div
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent text deselection
              e.stopPropagation(); // Prevent event bubbling
              saveSelection();
            }}
            className="fixed z-50 bg-purple-600 text-white rounded-lg shadow-lg flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-purple-700 transition-colors hover:scale-105"
            style={{
              left: `${Math.min(selectionPosition.x, window.innerWidth - 100)}px`,
              top: `${Math.max(selectionPosition.y - window.scrollY, 10)}px`,
            }}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span className="text-sm">Save</span>
          </div>
        )}

        {/* Prompts Panel */}
        {isPromptPanelOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold">Saved Prompts</h3>
                <button
                  onClick={() => setIsPromptPanelOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Create New Prompt Form */}
              <div className="p-4 border-b">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newPromptTitle}
                    onChange={(e) => setNewPromptTitle(e.target.value)}
                    placeholder="Prompt title..."
                    className="w-full rounded-lg border border-gray-200 p-2"
                  />
                  <textarea
                    value={newPromptContent}
                    onChange={(e) => setNewPromptContent(e.target.value)}
                    placeholder="Prompt content..."
                    className="w-full rounded-lg border border-gray-200 p-2 min-h-[100px]"
                  />
                  <input
                    type="text"
                    value={newPromptShortcut}
                    onChange={(e) => setNewPromptShortcut(e.target.value.slice(0, 1))}
                    placeholder="Keyboard shortcut (single character)..."
                    className="w-full rounded-lg border border-gray-200 p-2"
                    maxLength={1}
                  />
                  <p className="text-sm text-gray-500">
                    Press Ctrl+Alt+{newPromptShortcut || '[key]'} to use this prompt
                  </p>
                  <button
                    onClick={createNewPrompt}
                    disabled={!newPromptTitle.trim() || !newPromptContent.trim() || !newPromptShortcut.trim()}
                    className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Prompt
                  </button>
                </div>
              </div>
              
              {/* Prompts List */}
              <div className="overflow-y-auto max-h-[calc(80vh-16rem)]">
                {savedPrompts.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Create a prompt to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-4 p-4">
                    {savedPrompts.map((prompt) => (
                      <div key={prompt.id} className="bg-[#341A56] backdrop-blur-sm rounded-lg p-3 relative group flex flex-col h-full border border-white/10">
                        {editingPrompt?.id === prompt.id && (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editingPrompt.title}
                              onChange={(e) => setEditingPrompt({
                                ...editingPrompt,
                                title: e.target.value
                              })}
                              className="w-full rounded-lg border border-gray-200 p-2"
                            />
                            <input
                              type="text"
                              value={editingPrompt.shortcut || ''}
                              onChange={(e) => setEditingPrompt({
                                ...editingPrompt,
                                shortcut: e.target.value.slice(0, 1)
                              })}
                              placeholder="Keyboard shortcut (single character)..."
                              className="w-full rounded-lg border border-gray-200 p-2"
                              maxLength={1}
                            />
                            <textarea
                              value={editingPrompt.content}
                              onChange={(e) => setEditingPrompt({
                                ...editingPrompt,
                                content: e.target.value
                              })}
                              className="w-full rounded-lg border border-gray-200 p-2 min-h-[100px]"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => updatePrompt(editingPrompt)}
                                className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingPrompt(null)}
                                className="text-gray-500 hover:text-gray-700 px-4 py-2"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                        {!editingPrompt?.id && (
                          <div className="flex flex-col h-full">
                            <h4 className="font-medium text-lg cursor-pointer text-white/90 hover:text-white transition-colors"
                              onClick={() => {
                                const element = document.getElementById(`prompt-content-${prompt.id}`);
                                if (element) {
                                  element.style.display = element.style.display === 'none' ? 'block' : 'none';
                                }
                              }}
                            >
                              {prompt.title} {prompt.shortcut && <span className="text-sm text-white/60">(Ctrl+Alt+{prompt.shortcut})</span>}
                            </h4>
                            <div className="flex gap-3 mt-auto pt-3 justify-center border-t border-white/10">
                              <button 
                                onClick={() => usePrompt(prompt.content)}
                                className="text-white/70 hover:text-white p-1.5"
                                title="Use prompt"
                              >
                                <MessageSquarePlus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingPrompt(prompt)}
                                className="text-white/70 hover:text-white p-1.5"
                                title="Edit prompt"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deletePrompt(prompt.id)}
                                className="text-white/70 hover:text-white p-1.5"
                                title="Delete prompt"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                        {!editingPrompt?.id && (
                          <div 
                            id={`prompt-content-${prompt.id}`} 
                            className="mt-4 text-white/80 whitespace-pre-wrap" 
                            style={{ display: 'none' }}
                          >{prompt.content}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-24 right-8">
          <button
            onClick={() => setIsPromptPanelOpen(true)}
            className="glass-effect text-white rounded-full p-3 shadow-lg hover:bg-white/20 transition-all hover:scale-105 z-[9999] fixed bottom-56 right-8"
            title="Saved prompts"
          >
            <Sparkles className="w-6 h-6" />
          </button>
          <button
            onClick={clearChat}
            className="glass-effect text-white rounded-full p-3 shadow-lg hover:bg-white/20 transition-all hover:scale-105 z-[9999] fixed bottom-40 right-8"
            title="New chat"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>
      
        <ChatInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          selectedImage={selectedImage}
          handleImageSelect={handleImageSelect}
          handleImageRemove={handleImageRemove}
          handleSubmit={handleSubmit}
          inputRef={inputRef}
          fileInputRef={fileInputRef}
        />
      
        {/* Memory Panel */}
        {isMemoryPanelOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[80vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold">Saved Selections</h3>
                <div className="flex gap-2">
                  <select
                    value={selectedCollectionId}
                    onChange={(e) => setSelectedCollectionId(e.target.value)}
                    className="bg-purple-100 text-purple-800 rounded-lg px-3 py-2 border-none outline-none cursor-pointer hover:bg-purple-200 transition-colors"
                  >
                    {collections.map(collection => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setNewCollectionName('New Collection')}
                    className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>New Collection</span>
                  </button>
                  <button
                    onClick={copyAllSelections}
                    className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy All</span>
                  </button>
                  <button
                    onClick={downloadAllSelections}
                    className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Collection</span>
                  </button>
                  <button
                    onClick={downloadAllSelections}
                    className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Everything</span>
                  </button>
                  <button
                    onClick={() => setIsMemoryPanelOpen(false)}
                    className="text-gray-500 hover:text-gray-700 ml-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              {newCollectionName && (
                <div className="p-4 border-b">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="Collection name..."
                      className="flex-1 rounded-lg border border-gray-200 p-2"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          createNewCollection();
                        } else if (e.key === 'Escape') {
                          setNewCollectionName('');
                        }
                      }}
                    />
                    <button
                      onClick={createNewCollection}
                      className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setNewCollectionName('')}
                      className="text-gray-500 hover:text-gray-700 px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <div className="overflow-y-auto max-h-[calc(80vh-4rem)]">
                {collections.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Bookmark className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Create a collection to start saving selections</p>
                  </div>
                ) : (
                  (() => {
                    const currentCollection = collections.find(c => c.id === selectedCollectionId);
                    if (!currentCollection) return null;
                    
                    const collectionSelections = savedSelections.filter(s => s.collectionId === selectedCollectionId);
                    const dateGroups = groupSelectionsByDate(collectionSelections);
                    
                    return (
                      <div key={currentCollection.id} className="border-b last:border-b-0">
                        <div className="flex items-center justify-between p-4 bg-gray-50">
                          {editingCollection === currentCollection.id ? (
                            <input
                              type="text"
                              value={currentCollection.name}
                              onChange={(e) => {
                                setCollections(prev => prev.map(c =>
                                  c.id === currentCollection.id ? { ...c, name: e.target.value } : c
                                ));
                              }}
                              onBlur={() => setEditingCollection(null)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  renameCollection(currentCollection.id, currentCollection.name);
                                }
                              }}
                              className="rounded border px-2 py-1"
                              autoFocus
                            />
                          ) : (
                            <h4 className="font-medium">{currentCollection.name}</h4>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingCollection(currentCollection.id)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            {currentCollection.id !== 'default' && (
                              <button
                                onClick={() => deleteCollection(currentCollection.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        {Object.entries(dateGroups).map(([date, selections]) => (
                          <div key={date} className="p-4">
                            <h5 className="text-sm font-medium text-gray-500 mb-2">{date}</h5>
                            <div className="space-y-2">
                              {selections.map((selection) => (
                                <div key={selection.id} className="bg-gray-50 rounded-lg p-4 relative group flex justify-between items-start">
                                  <p className="whitespace-pre-wrap text-gray-700 flex-1">{selection.text}</p>
                                  <div className="ml-4">
                                    <button
                                      onClick={() => copyText(selection.text)}
                                      className="text-purple-600 hover:text-purple-800 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                      title="Copy text"
                                    >
                                      <Copy className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => removeSelection(selection.id)}
                                      className="text-red-500 hover:text-red-700 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          </div>
        )}
      
        {/* Comparison Modal */}
        {comparisonMode && comparedResponses && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[80vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Response Comparison</h3>
                <button
                  onClick={closeComparison}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex divide-x h-[calc(80vh-4rem)] overflow-hidden">
                {comparedResponses.map((response, index) => (
                  <div key={index} className="flex-1 p-6 overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{response.model}</h2>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{response.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default index;