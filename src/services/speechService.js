export class SpeechService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;

    this.initRecognition();
  }

  // Initialiser la reconnaissance vocale
  initRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();

      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'fr-FR';
    }
  }

  // Démarrer l'écoute
  startListening(onResult, onError) {
    if (!this.recognition) {
      onError('Reconnaissance vocale non supportée');
      return;
    }

    this.isListening = true;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      onResult(transcript, confidence);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.start();
  }

  // Arrêter l'écoute
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Text-to-Speech
  speak(text, options = {}) {
    if (!this.synthesis) {
      console.error('Speech Synthesis non supporté');
      return;
    }

    // Arrêter toute parole en cours
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'fr-FR';
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;

    this.synthesis.speak(utterance);
  }

  // Arrêter la parole
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  // Obtenir les voix disponibles
  getVoices() {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  // Vérifier le support
  isSupported() {
    return !!(this.recognition && this.synthesis);
  }
}

// Instance par défaut
export const speechService = new SpeechService();