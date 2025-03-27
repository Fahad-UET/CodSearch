import React, { useEffect, useState } from 'react';
import {
  Pencil,
  Type,
  Settings,
  Bold,
  Italic,
  Underline,
  AlignRight,
  AlignLeft,
  AlignCenter,
  Undo,
  Redo,
  XCircle,
  Scissors,
  Copy,
  ClipboardPaste,
  Mic,
  Save,
  Trash2,
  DollarSign,
} from 'lucide-react';
import { useSavedTextsStore } from '@/store/savedTextStore';
import { useEditorStore } from '@/store/editorStore';
import { useVariableStore } from '@/store/variableStore';
import TextLibrary from './updatedAdCopy/library/TextLibrary';
import QuickPhrases from './updatedAdCopy/editor/QuickPhrases';
import VariableSelector from './updatedAdCopy/editor/VariableSelector';
import { getKeyMapping } from '../../utils/keyboardMapping';
import ArabicKeyboard from './updatedAdCopy/keyboard/ArabicKeyboard';
import SpanishKeyboard from './updatedAdCopy/keyboard/SpanishKeyboard';
import FrenchKeyboard from './updatedAdCopy/keyboard/FrenchKeyboard';
import EnglishKeyboard from './updatedAdCopy/keyboard/EnglishKeyboard';
import EmojiPicker from './updatedAdCopy/editor/EmojiPicker';
import FontSelector from './updatedAdCopy/editor/FontSelector';
import ColorSelector from './updatedAdCopy/editor/ColorSelector';
import FontSizeSelector from './updatedAdCopy/editor/FontSizeSelector';
import { keyboardThemes } from '../../utils/keyboardThemes';
import Notification from './updatedAdCopy/ui/Notification';
import VariableSelectorComp from './updatedAdCopy/editor/VariableSelectorComp';
import {
  createEditorAiText,
  deleteEditorAiText,
  updateEditorAiText,
} from '@/services/firebase/textEditor';
import { updateProduct as updateProductService } from '@/services/firebase';
import { useProductStore } from '@/store';
import { getCredits, updateCredits } from '@/services/firebase/credits';
import CreditsInformation from '../credits/CreditsInformation';
// to resolve build issue please check this
// export function AdCopy({ activeTabParen, product }: { activeTabParen: string; product: any }) {
export function AdCopy({ activeTabParen, product }: { activeTabParen?: string; product?: any }) {
  const [activeTab, setActiveTab] = useState(activeTabParen || 'editor');
  const { editorContent, setEditorContent } = useEditorStore();
  const { variables, replaceVariables } = useVariableStore();
  const { userPackage, setPackage } = useProductStore();
  const updateProduct = useProductStore(state => state.updateProduct);
  const { savedTexts, tags, addText, updateText, activeText, setActiveText } = useSavedTextsStore();

  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  const SIZES = [
    { name: 'Très petit', value: '1' },
    { name: 'Petit', value: '2' },
    { name: 'Normal', value: '3' },
    { name: 'Moyen', value: '4' },
    { name: 'Grand', value: '5' },
    { name: 'Très grand', value: '6' },
    { name: 'Maximum', value: '7' },
  ];
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [shiftMode, setShiftMode] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'ar' | 'es' | 'fr' | 'en'>('ar');
  const [showCurrencySelector, setShowCurrencySelector] = useState<any>('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(SIZES[2]); // Normal by default
  const { user } = useProductStore();

  const handleClearText = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      setEditorContent('');
      saveToHistory('');
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);

    try {
      // Get clipboard data
      const text = e.clipboardData.getData('text/plain');

      // Insert the text at cursor position
      range.deleteContents();
      range.insertNode(document.createTextNode(text));

      // Move cursor to end of inserted text
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);

      // Update state
      if (editorRef.current) {
        const newContent = editorRef.current.innerHTML;
        setEditorContent(newContent);
        saveToHistory(newContent);
      }
    } catch (err) {
      console.error('Erreur lors du collage:', err);
    }
  };

  const saveToHistory = (newText: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newText);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setEditorContent(history[historyIndex - 1]);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[historyIndex - 1];
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setEditorContent(history[historyIndex + 1]);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[historyIndex + 1];
      }
    }
  };

  const handleFormat = (format: string, value?: string) => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    // Vérifier si le format est déjà appliqué
    let isFormatActive = false;
    switch (format) {
      case 'bold':
        isFormatActive = document.queryCommandState('bold');
        break;
      case 'italic':
        isFormatActive = document.queryCommandState('italic');
        break;
      case 'underline':
        isFormatActive = document.queryCommandState('underline');
        break;
      case 'align-right':
        isFormatActive = document.queryCommandState('justifyRight');
        break;
      case 'align-center':
        isFormatActive = document.queryCommandState('justifyCenter');
        break;
      case 'align-left':
        isFormatActive = document.queryCommandState('justifyLeft');
        break;
      case 'color':
        isFormatActive = value && document.queryCommandValue('foreColor') === value;
        break;
      case 'font-size':
        isFormatActive = value && document.queryCommandValue('fontSize') === value;
        break;
      case 'font-family':
        isFormatActive = value && document.queryCommandValue('fontName') === value;
        break;
      default:
        return;
    }

    switch (format) {
      case 'bold':
        document.execCommand('bold', false, isFormatActive ? '' : undefined);
        break;
      case 'italic':
        document.execCommand('italic', false, isFormatActive ? '' : undefined);
        break;
      case 'underline':
        document.execCommand('underline', false, isFormatActive ? '' : undefined);
        break;
      case 'align-right':
        document.execCommand('justifyRight', false, isFormatActive ? '' : undefined);
        break;
      case 'align-center':
        document.execCommand('justifyCenter', false, isFormatActive ? '' : undefined);
        break;
      case 'align-left':
        document.execCommand('justifyLeft', false, isFormatActive ? '' : undefined);
        break;
      case 'color':
        document.execCommand('foreColor', false, value);
        break;
      case 'font-size':
        document.execCommand('fontSize', false, value);
        break;
      case 'font-family':
        document.execCommand('fontName', false, value);
        break;
      // @ts-ignore
      case 'clear':
        {
          const selection = window.getSelection();
          if (!selection || !editorRef.current) return;

          // Si aucun texte n'est sélectionné, sélectionner tout le contenu
          if (selection.isCollapsed) {
            const range = document.createRange();
            range.selectNodeContents(editorRef.current);
            selection.removeAllRanges();
            selection.addRange(range);
          }

          // Supprimer toutes les mises en forme
          document.execCommand('removeFormat', false);

          // Réinitialiser le style du bloc
          document.execCommand('formatBlock', false, 'div');

          // Réinitialiser l'alignement
          document.execCommand('justifyLeft', false);

          // Réinitialiser la couleur
          document.execCommand('foreColor', false, '#000000');

          // Réinitialiser la taille de police
          document.execCommand('fontSize', false, '3');

          // Réinitialiser la police
          document.execCommand('fontName', false, 'Arial');

          // Restaurer la sélection si nécessaire
          if (selection.isCollapsed) {
            selection.removeAllRanges();
          }
        }
        break;
      default:
        return;
    }

    // Save state
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setEditorContent(newContent);
      saveToHistory(newContent);
    }
  };
  const [fnMode, setFnMode] = useState(false);

  const handleKeyboardInput = (input: string) => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    // Replace variables in the input
    const processedInput = replaceVariables(input);

    // Always append text at the end
    if (editorRef.current.lastChild && editorRef.current.lastChild.nodeType === Node.TEXT_NODE) {
      editorRef.current.lastChild.textContent += processedInput;
    } else {
      const textNode = document.createTextNode(processedInput);
      editorRef.current.appendChild(textNode);
    }

    // Move cursor to end
    const range = document.createRange();

    range.selectNodeContents(editorRef.current);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);

    // Sauvegarder l'état
    const newContent = editorRef.current.innerHTML;
    setEditorContent(newContent);
    saveToHistory(newContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const mappedKey = getKeyMapping(activeLanguage, e.key, e.shiftKey);
    if (mappedKey) {
      setPressedKey(mappedKey);
      e.preventDefault();
      handleKeyboardInput(mappedKey);
      setTimeout(() => setPressedKey(null), 200);
    }
  };

  const handleKeyPress = (button: string) => {
    if (button === '{space}') {
      handleKeyboardInput(' ');
    }
  };

  const CreditAlert = (show: boolean, message: string, type: 'error' | 'success') => {
    setNotification({
      show,
      message,
      type,
    });
  };

  const handleSaveOrUpdateText = async () => {
    try {
      const content = editorRef.current?.textContent?.trim();

      if (!content) {
        setNotification({
          show: true,
          message: 'Please enter some text first',
          type: 'error',
        });
        return;
      }

      // Placeholder validation and replacement
      const placeholderPattern = /\{\{(\w+)\}\}/g;
      let updatedContent = content;

      const unmatchedPlaceholders = [];
      updatedContent = updatedContent.replace(placeholderPattern, (match, key) => {
        const variableMatch = variables.find(v => v.name === key);
        if (variableMatch) {
          return variableMatch.value;
        } else {
          unmatchedPlaceholders.push(key);
          return match; // Keep the original placeholder if no match
        }
      });

      if (unmatchedPlaceholders.length > 0) {
        setNotification({
          show: true,
          message: `Unmatched placeholders found: ${unmatchedPlaceholders.join(', ')}`,
          type: 'error',
        });
        return;
      }

      // Get the formatted date as 'day-month-year'
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, '0')}-${currentDate.getFullYear()}`;

      // Check if there is an active text (to update)
      const productId = product.id;

      if (activeText) {
        const clonedGenerated = structuredClone(product?.generatedText || []);
        const updatedGenerated = clonedGenerated.map(item => {
          if (item.id === activeText.id) {
            return { ...item, title: updatedContent };
          }
          return item;
        });
        await updateProductService(product?.id, { generatedText: updatedGenerated });
        updateProduct(product?.id, { generatedText: updatedGenerated });
        setNotification({
          show: true,
          message: 'Text updated successfully! 🎉',
          type: 'success',
        });
      } else {
        const credits = await getCredits(user?.uid, 'textLibrary');
        if (!credits) {
          CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
          return;
        }
        const uniqueId = `text-${crypto.randomUUID()}`;
        const newText: any = {
          id: uniqueId,
          // productId,
          content: updatedContent,
          language: activeLanguage,
          tags: [],
          date: formattedDate,
        };
        const clonedGenerated = structuredClone(product?.generatedText || []);
        const newlyCreated = [...clonedGenerated, newText];

        await updateProductService(product?.id, { generatedText: newlyCreated });
        const result = await updateCredits(user?.uid, 'textLibrary');
        setPackage(userPackage.plan, result.toString());
        updateProduct(product?.id, { generatedText: newlyCreated });
        // await updateEditorAiTextSerive(product?.id,{generatedText:newlyCreated});
        // addText(newText);
        setNotification({
          show: true,
          message: 'Text saved successfully! 🎉',
          type: 'success',
        });
      }

      const virtualTextAI = {
        productId: product.productId,
        savedTexts: savedTexts,
      };

      setEditorContent('');
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'editor', icon: Pencil, label: 'Virtual Keyboard' },
    { id: 'templates', icon: Type, label: 'Text Library' },
    { id: 'variables', icon: Settings, label: 'Variables' },
  ];

  useEffect(() => {
    if (activeTab === 'adcopy') {
      setActiveTab('editor');
    } else {
      setActiveTab(activeTabParen);
    }
    // setActiveTab(activeTabParen)
  }, [activeTabParen]);

  const onSelect = size => handleFormat('font-size', size);

  const handleSelect = (size: (typeof SIZES)[0]) => {
    setSelectedSize(size);
    onSelect(size.value);
    setIsOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <>
        {activeTabParen === 'adcopy' && (
          <div className=" bg-black  shadow-lg relative px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    data-tab={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors relative rounded-lg ${
                      activeTab === tab.id
                        ? 'text-[#6E3FC3] bg-white shadow-md'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                      {tab.id === 'keyboard' ? '10' : '0'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </>

      <div
        className={`flex-1 p-4  ${keyboardThemes[activeLanguage].metallic} bg-opacity-5 transition-colors duration-500`}
      >
        {activeTab === 'templates' ? (
          <TextLibrary product={product} setActiveTab={(id: string) => setActiveTab(id)} />
        ) : activeTab === 'editor' ? (
          <>
            <div className="border-b border-gray-200 bg-gray-50/50 relative z-[23232332]">
              <div className="flex flex-col gap-2 p-2">
                {/* First row */}
                <div className="flex justify-between relative z-50">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Edit buttons */}
                    <div className="flex items-center gap-1 p-1 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200/50">
                      <button
                        onClick={() => document.execCommand('cut')}
                        className="p-2 rounded-lg bg-gradient-to-b from-white to-gray-50 border border-gray-200 hover:from-purple-50 hover:to-white text-gray-700 hover:text-[#5D1C83] shadow-sm hover:shadow-md transition-all"
                      >
                        <Scissors className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => document.execCommand('copy')}
                        className="p-2 rounded-lg bg-gradient-to-b from-white to-gray-50 border border-gray-200 hover:from-purple-50 hover:to-white text-gray-700 hover:text-[#5D1C83] shadow-sm hover:shadow-md transition-all"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => document.execCommand('paste')}
                        className="p-2 rounded-lg bg-gradient-to-b from-white to-gray-50 border border-gray-200 hover:from-purple-50 hover:to-white text-gray-700 hover:text-[#5D1C83] shadow-sm hover:shadow-md transition-all"
                      >
                        <ClipboardPaste className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Format buttons */}
                    <div className="flex items-center gap-1 p-1 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200/50">
                      <button
                        onClick={() => handleFormat('bold')}
                        className="p-2 rounded-lg bg-gradient-to-b from-white to-gray-50 border border-gray-200 hover:from-purple-50 hover:to-white text-gray-700 hover:text-[#5D1C83] shadow-sm hover:shadow-md transition-all"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleFormat('italic')}
                        className="p-2 rounded-lg bg-gradient-to-b from-white to-gray-50 border border-gray-200 hover:from-purple-50 hover:to-white text-gray-700 hover:text-[#5D1C83] shadow-sm hover:shadow-md transition-all"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleFormat('underline')}
                        className="p-2 rounded-lg bg-gradient-to-b from-white to-gray-50 border border-gray-200 hover:from-purple-50 hover:to-white text-gray-700 hover:text-[#5D1C83] shadow-sm hover:shadow-md transition-all"
                      >
                        <Underline className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Alignment buttons */}
                    <div className="flex items-center gap-1 p-1 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200/50">
                      <button
                        onClick={() => handleFormat('align-right')}
                        className="p-2 rounded-lg bg-gradient-to-b from-white to-gray-50 border border-gray-200 hover:from-purple-50 hover:to-white text-gray-700 hover:text-[#5D1C83] shadow-sm hover:shadow-md transition-all"
                      >
                        <AlignRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleFormat('align-center')}
                        className="p-2 rounded-lg bg-gradient-to-b from-white to-gray-50 border border-gray-200 hover:from-purple-50 hover:to-white text-gray-700 hover:text-[#5D1C83] shadow-sm hover:shadow-md transition-all"
                      >
                        <AlignCenter className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleFormat('align-left')}
                        className="p-2 rounded-lg bg-gradient-to-b from-white to-gray-50 border border-gray-200 hover:from-purple-50 hover:to-white text-gray-700 hover:text-[#5D1C83] shadow-sm hover:shadow-md transition-all"
                      >
                        <AlignLeft className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Color, Size, Font buttons */}
                    <div className="flex items-center gap-1 p-1 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200/50">
                      <ColorSelector onSelect={color => handleFormat('color', color)} />
                      <div className="relative">
                        {' '}
                        <FontSizeSelector
                          handleSelect={handleSelect}
                          isOpen={isOpen}
                          setIsOpen={setIsOpen}
                          selectedSize={selectedSize}
                        />
                        {isOpen && (
                          <div className="fixed top-auto left-auto mt-1 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-xl  border border-gray-200 py-1 z-[9999] overflow-auto">
                            {SIZES.map(size => (
                              <button
                                key={size.value}
                                onClick={() => handleSelect(size)}
                                className="w-full px-4 py-2 text-sm text-left hover:bg-purple-50 hover:text-[#5D1C83] transition-colors flex items-center justify-between"
                              >
                                <span>{size.name}</span>
                                <span className="text-gray-400">{size.value}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <FontSelector onSelect={font => handleFormat('font-family', font)} />
                    </div>

                    {/* Extra features */}
                    <div className="flex items-center gap-1 p-1 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200/50">
                      <EmojiPicker onSelect={handleKeyboardInput} />
                      <button
                        onClick={() => {
                          /* TODO: Implement voice input */
                        }}
                        className="p-2 rounded-lg bg-gradient-to-b from-white to-gray-50 border border-gray-200 hover:from-purple-50 hover:to-white text-gray-700 hover:text-[#5D1C83] shadow-sm hover:shadow-md transition-all"
                        title="Voice input"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>

                    {/* History buttons */}
                    <div className="flex items-center gap-1 p-1 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200/50">
                      <button
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className="p-2 rounded-lg bg-gradient-to-b from-white to-gray-50 border border-gray-200 hover:from-purple-50 hover:to-white text-gray-700 hover:text-[#5D1C83] shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Undo className="w-4 h-4" />
                      </button>
                      <button
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className="p-2 rounded-lg bg-gradient-to-b from-white to-gray-50 border border-gray-200 hover:from-purple-50 hover:to-white text-gray-700 hover:text-[#5D1C83] shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Redo className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ">
                    <button
                      onClick={handleClearText}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-700 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm  border-2 border-gray-400/50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Text
                    </button>
                    <button
                      onClick={handleSaveOrUpdateText}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-700 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm  border-2 border-gray-400/50"
                    >
                      <Save className="w-4 h-4" />
                      {activeText ? 'Update Text' : 'Save Text'}
                    </button>
                  </div>
                </div>

                {/* Second row */}
                <div className="flex items-center justify-between gap-2 ">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowKeyboard(!showKeyboard)}
                      className="px-3 py-1.5 text-sm text-[#5D1C83] bg-gradient-to-b from-white to-gray-50 rounded-lg border border-gray-200 hover:from-purple-50 hover:to-white shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                    >
                      {showKeyboard ? 'Hide keyboard' : 'Show keyboard'}
                    </button>
                    <QuickPhrases onSelect={handleKeyboardInput} activeLanguage={activeLanguage} />
                    <VariableSelector onSelect={handleKeyboardInput} />
                    <button
                      onClick={() => setShowCurrencySelector(!showCurrencySelector)}
                      className="px-3 py-1.5 text-sm text-[#5D1C83] bg-gradient-to-b from-white to-gray-50 rounded-lg border border-gray-200 hover:from-purple-50 hover:to-white shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      Currencies
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveLanguage('en')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                        activeLanguage === 'en'
                          ? 'bg-purple-900/90 text-white shadow-md border-purple-800/50 hover:bg-purple-800'
                          : 'hover:bg-purple-100 text-purple-700 border-purple-200'
                      }`}
                    >
                      🇺🇸 English
                    </button>
                    <button
                      onClick={() => setActiveLanguage('fr')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                        activeLanguage === 'fr'
                          ? 'bg-blue-900/90 text-white shadow-md border-blue-800/50 hover:bg-blue-800'
                          : 'hover:bg-blue-100 text-blue-700 border-blue-200'
                      }`}
                    >
                      🇫🇷 Français
                    </button>
                    <button
                      onClick={() => setActiveLanguage('es')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                        activeLanguage === 'es'
                          ? 'bg-red-900/90 text-white shadow-md border-red-800/50 hover:bg-red-800'
                          : 'hover:bg-red-100 text-red-700 border-red-200'
                      }`}
                    >
                      🇪🇸 Español
                    </button>
                    <button
                      onClick={() => setActiveLanguage('ar')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                        activeLanguage === 'ar'
                          ? 'bg-emerald-900/90 text-white shadow-md border-emerald-800/50 hover:bg-emerald-800'
                          : 'hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      🇸🇦 العربية
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {/* Text area */}
              <div className="relative">
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={e => {
                    const newContent = e.currentTarget.innerHTML;
                    setEditorContent(newContent);
                    saveToHistory(newContent);
                  }}
                  onPaste={handlePaste}
                  onKeyDown={handleKeyDown}
                  className={`w-full p-3 text-2xl text-gray-800 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] transition-all duration-300 text-right arabic-input outline-none relative z-0 custom-scrollbar overflow-y-auto ${
                    showKeyboard ? 'h-48' : 'h-[calc(100vh-16rem)]'
                  }`}
                  dir="rtl"
                  dangerouslySetInnerHTML={{ __html: editorContent }}
                ></div>
              </div>

              {/* Virtual keyboard */}
              {showKeyboard &&
                {
                  ar: (
                    <ArabicKeyboard
                      onKeyPress={handleKeyboardInput}
                      pressedKey={pressedKey}
                      fnMode={fnMode}
                      onFnToggle={() => setFnMode(!fnMode)}
                      shiftMode={shiftMode}
                      onShiftToggle={() => setShiftMode(!shiftMode)}
                    />
                  ),
                  es: (
                    <SpanishKeyboard
                      onKeyPress={handleKeyboardInput}
                      pressedKey={pressedKey}
                      fnMode={fnMode}
                      onFnToggle={() => setFnMode(!fnMode)}
                      shiftMode={shiftMode}
                      onShiftToggle={() => setShiftMode(!shiftMode)}
                    />
                  ),
                  fr: (
                    <FrenchKeyboard
                      onKeyPress={handleKeyboardInput}
                      pressedKey={pressedKey}
                      fnMode={fnMode}
                      onFnToggle={() => setFnMode(!fnMode)}
                      shiftMode={shiftMode}
                      onShiftToggle={() => setShiftMode(!shiftMode)}
                    />
                  ),
                  en: (
                    <EnglishKeyboard
                      onKeyPress={handleKeyboardInput}
                      pressedKey={pressedKey}
                      fnMode={fnMode}
                      onFnToggle={() => setFnMode(!fnMode)}
                      shiftMode={shiftMode}
                      onShiftToggle={() => setShiftMode(!shiftMode)}
                    />
                  ),
                }[activeLanguage]}
            </div>
          </>
        ) : (
          activeTab === 'variables' && (
            <VariableSelectorComp onSelect={() => {}} product={product} />
          )
        )}
      </div>

      {/* Notification */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
}
