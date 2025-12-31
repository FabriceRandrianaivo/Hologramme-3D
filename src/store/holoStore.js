import { create } from 'zustand';

export const useHoloStore = create((set) => ({
  // États
  aiActive: false,
  rotation: true,
  color: '#00ffff',
  message: 'Système holographique initialisé',
  isThinking: false,
  chatHistory: [],

  // Actions pour l'IA
  setAiActive: (active) => set({
    aiActive: active,
    color: active ? '#00ff88' : '#00ffff',
    message: active ? 'IA activée - Prêt à interagir' : 'IA en veille'
  }),

  setIsThinking: (isThinking) => set({ isThinking }),

  // Actions pour l'hologramme
  setRotation: (rotation) => set({ rotation }),

  setColor: (color) => set({ color }),

  setMessage: (message) => set({ message }),

  // Actions pour le chat
  addMessage: (role, content) => set((state) => ({
    chatHistory: [...state.chatHistory, { role, content, timestamp: Date.now() }]
  })),

  clearChat: () => set({ chatHistory: [] }),

  // Reset complet
  reset: () => set({
    aiActive: false,
    rotation: true,
    color: '#00ffff',
    message: 'Système réinitialisé',
    isThinking: false,
    chatHistory: []
  })
}));