// Couleurs holographiques
export const COLORS = {
  CYAN: '#00d2ff',
  ACTIVE_BLUE: '#0078ff',
  BLUE: '#0088ff',
  PURPLE: '#8800ff',
  PINK: '#ff00ff',
  ORANGE: '#ff8800',
  RED: '#ff0088',
  SKIN_LIGHT: '#ffdbac',
  SKIN_MEDIUM: '#e0ac69',
  SKIN_DARK: '#8d5524'
};

// États de l'IA
export const AI_STATUS = {
  IDLE: 'idle',
  THINKING: 'thinking',
  SPEAKING: 'speaking',
  LISTENING: 'listening',
  ERROR: 'error'
};

// Configuration de l'animation
export const ANIMATION = {
  ROTATION_SPEED: 0.5,
  HOVER_SCALE: 1.1,
  PULSE_SPEED: 1.5,
  TRANSITION_DURATION: 300
};

// Configuration 3D
export const SCENE_CONFIG = {
  CAMERA: {
    POSITION: [0, 2, 6],
    FOV: 50,
    NEAR: 0.1,
    FAR: 1000
  },
  CONTROLS: {
    MIN_DISTANCE: 3,
    MAX_DISTANCE: 10,
    ENABLE_PAN: false
  },
  LIGHTS: {
    AMBIENT: 0.2,
    POINT_MAIN: 0.5,
    POINT_SECONDARY: 0.3
  }
};

// Configuration de l'IA
// Configuration de l'IA (Gemini)
// Configuration de l'IA (Gemini)
// Configuration de l'IA (Gemini)
// Configuration de l'IA (Gemini)
// Configuration de l'IA (Gemini)
export const GEMINI_CONFIG = {
  MODELS: [
    // --- Modèles Gratuits Vérifiés (✅ OK) ---
    { id: 'gemini-3-flash-preview', name: 'Gemini 3.0 Flash (🚀 New Speed King)' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (⚡ High Perf)' },
    { id: 'gemini-flash-latest', name: 'Gemini 1.5 Flash (🛡️ Stable)' },
    { id: 'gemma-3-27b-it', name: 'Gemma 3 27B (🦎 Open Expert)' },

    // --- Modèles Payants / Quota (⛔ Limit: 0) ---
    { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro [Paid Only]' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro [Paid Only]' },
  ],
  DEFAULT_MODEL: 'gemini-2.5-flash',
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.7
};

// Messages système
export const MESSAGES = {
  INIT: 'Système holographique initialisé',
  AI_ACTIVATED: 'Intelligence artificielle activée',
  AI_DEACTIVATED: 'Intelligence artificielle désactivée',
  THINKING: 'IA en train de réfléchir...',
  LISTENING: 'Écoute en cours...',
  SPEAKING: 'Hologramme en train de parler...',
  ERROR: 'Une erreur est survenue',
  NO_API_KEY: 'Clé API non configurée'
};

// Particules
export const PARTICLES_CONFIG = {
  COUNT: 1000,
  SIZE: 0.02,
  OPACITY: 0.3,
  SPREAD: 8
};