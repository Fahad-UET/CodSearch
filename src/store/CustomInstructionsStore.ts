import create from 'zustand';
import { persist } from 'zustand/middleware';

// Define the CustomInstruction type
interface CustomInstruction {
  id: string;
  name: string;
  content: string;
  tabId: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Zustand store
interface CustomInstructionsState {
  instructions: CustomInstruction[];
  createInstruction: (data: any) => void;
  updateInstruction: (id: string, data: Partial<CustomInstruction>) => void;
  deleteInstruction: (id: string) => void;
  setDefaultInstruction: (id: string) => void;
}

export const useCustomInstructionsStore = create<CustomInstructionsState>()(
  persist(
    set => ({
      instructions: [],
      // createInstruction: data =>
      //   set(state => {
      //     const newInstruction: CustomInstruction = {
      //       id: crypto.randomUUID(),
      //       name: data.name,
      //       content: data.content,
      //       tabId: data.tabId,
      //       isDefault: data.isDefault || false,
      //       createdAt: new Date(),
      //       updatedAt: new Date(),
      //     };

      //     // Remove default flag from other instructions in the same tab
      //     if (newInstruction.isDefault) {
      //       set(state => ({
      //         instructions: state.map((instruction: any) => ({
      //           ...instruction,
      //           isDefault: instruction.tabId === data.tabId ? false : instruction.isDefault,
      //         })),
      //       }));
      //     }

      //     return { instructions: [...state.instructions, newInstruction] };
      //   }),
      createInstruction: data =>
        set(state => {
          const newInstruction: CustomInstruction = {
            id: crypto.randomUUID(),
            name: data.name,
            content: data.content,
            tabId: data.tabId,
            isDefault: data.isDefault || false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
      
          // Remove default flag from other instructions in the same tab
          let updatedInstructions = state.instructions;
          if (newInstruction.isDefault) {
            updatedInstructions = state.instructions.map(instruction => ({
              ...instruction,
              isDefault: instruction.tabId === data.tabId ? false : instruction.isDefault,
            }));
          }
      
          return { instructions: [...updatedInstructions, newInstruction] };
        }),
      
      updateInstruction: (id, data) =>
        set(state => ({
          instructions: state.instructions.map(instruction =>
            instruction.id === id ? { ...instruction, ...data, updatedAt: new Date() } : instruction
          ),
        })),
      deleteInstruction: id =>
        set(state => ({ instructions: state.instructions.filter(i => i.id !== id) })),
      setDefaultInstruction: id =>
        set(state => ({
          instructions: state.instructions.map(instruction => ({
            ...instruction,
            isDefault:
              instruction.id === id
                ? true
                : instruction.tabId === state.instructions.find(i => i.id === id)?.tabId
                ? false
                : instruction.isDefault,
          })),
        })),
    }),
    {
      name: 'custom-instructions', // Persisted storage key
      version: 1,
    }
  )
);
