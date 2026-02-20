import { create } from 'zustand';

interface BotState {
  isListening: boolean;
  isProcessing: boolean;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  setIsListening: (val: boolean) => void;
  setIsProcessing: (val: boolean) => void;
  addMessage: (msg: { role: 'user' | 'assistant'; content: string }) => void;
}

export const useBotStore = create<BotState>((set) => ({
  isListening: false,
  isProcessing: false,
  messages: [],
  setIsListening: (val) => set({ isListening: val }),
  setIsProcessing: (val) => set({ isProcessing: val }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
}));
