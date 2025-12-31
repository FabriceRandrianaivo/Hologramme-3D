import { create } from 'zustand';

export const useAIStore = create((set) => ({
    // Configuration de l'IA
    apiKey: null,
    model: 'claude-sonnet-4-20250514',

    // État de la conversation
    conversationId: null,
    messages: [],
    isStreaming: false,
    currentResponse: '',

    // Paramètres
    temperature: 0.7,
    maxTokens: 1000,

    // Actions
    setApiKey: (apiKey) => set({ apiKey }),

    setModel: (model) => set({ model }),

    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),

    setIsStreaming: (isStreaming) => set({ isStreaming }),

    setCurrentResponse: (currentResponse) => set({ currentResponse }),

    updateTemperature: (temperature) => set({ temperature }),

    updateMaxTokens: (maxTokens) => set({ maxTokens }),

    clearMessages: () => set({ messages: [], currentResponse: '' }),

    reset: () => set({
        conversationId: null,
        messages: [],
        isStreaming: false,
        currentResponse: '',
        temperature: 0.7,
        maxTokens: 1000
    })
}));