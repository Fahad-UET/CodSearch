import create from 'zustand';
import { persist } from 'zustand/middleware';

interface EditorState {
  editorContent: string;
  setEditorContent: (content: string) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    set => ({
      editorContent: '',
      setEditorContent: content => set(() => ({ editorContent: content })),
    }),
    {
      name: 'editor-store',
      version: 1,
    }
  )
);
