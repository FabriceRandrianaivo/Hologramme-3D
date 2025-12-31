// Couleurs holographiques
export const COLORS = {
  CYAN: '#00ffff',
  GREEN: '#00ff88',
  BLUE: '#0088ff',
  PURPLE: '#8800ff',
  PINK: '#ff00ff',
  ORANGE: '#ff8800',
  RED: '#ff0088'
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
export const AI_CONFIG = {
  DEFAULT_MODEL: 'claude-sonnet-4-20250514',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  API_VERSION: '2023-06-01'
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