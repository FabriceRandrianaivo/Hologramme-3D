import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { COLORS } from '../utils/constants';

export const useHoloStore = create(
  persist(
    (set) => ({
      // États
      aiActive: false,
      rotation: true,
      color: COLORS.CYAN,
      message: 'Système holographique initialisé',
      isThinking: false,
      chatHistory: [],

      // Actions pour l'IA
      setAiActive: (active) => set({
        aiActive: active,
        color: active ? COLORS.ACTIVE_BLUE : COLORS.CYAN,
        message: active ? 'IA activée - Prêt à interagir' : 'IA en veille'
      }),

      setIsThinking: (isThinking) => set({ isThinking }),

      // État Personnalisation
      voiceName: null,
      avatarType: 'face',
      voiceEnabled: true,
      geminiModel: 'gemini-2.5-flash',

      // Actions
      setVoiceName: (voiceName) => set({ voiceName }),
      setAvatarType: (avatarType) => set({ avatarType }),
      setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
      setGeminiModel: (model) => set({ geminiModel: model }),

      // Face Tracking (Webcam)
      faceTrackingActive: false,
      faceRotation: { x: 0, y: 0, z: 0 },
      setIsFaceTrackingActive: (active) => set({ faceTrackingActive: active }),
      setFaceRotation: (rotation) => set({ faceRotation: rotation }),

      isSpeaking: false,
      setIsSpeaking: (speaking) => set({ isSpeaking: speaking }),

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
        color: COLORS.CYAN,
        message: 'Système réinitialisé',
        isThinking: false,
        chatHistory: []
      })
    }),
    {
      name: 'holo-storage',
      partialize: (state) => ({
        voiceName: state.voiceName,
        avatarType: state.avatarType,
        voiceEnabled: state.voiceEnabled,
        geminiModel: state.geminiModel,
        color: state.color
      }),
    }
  )
);