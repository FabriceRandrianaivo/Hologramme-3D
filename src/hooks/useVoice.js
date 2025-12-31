import { useState, useEffect, useCallback } from 'react';
import { useHoloStore } from '../store/holoStore';

export const useVoice = () => {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const { setMessage } = useHoloStore();

    useEffect(() => {
        // Vérifier si le navigateur supporte la reconnaissance vocale
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();

            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'fr-FR';

            setRecognition(recognitionInstance);
        } else {
            console.warn('Reconnaissance vocale non supportée');
        }
    }, []);

    // Démarrer l'écoute
    const startListening = (onResult) => {
        if (!recognition) {
            setMessage('❌ Reconnaissance vocale non disponible');
            return;
        }

        setIsListening(true);
        setMessage('🎤 Écoute en cours...');

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setMessage(`Vous avez dit: "${transcript}"`);
            if (onResult) onResult(transcript);
            return transcript;
        };

        recognition.onerror = (event) => {
            setMessage(`Erreur: ${event.error}`);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    // Arrêter l'écoute
    const stopListening = () => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
            setMessage('Écoute arrêtée');
        }
    };

    // Text-to-Speech
    const speak = (text) => {
        const { voiceEnabled, voiceName, setIsSpeaking } = useHoloStore.getState();
        console.log('[useVoice] Speak requested:', { text, voiceEnabled, voiceName });

        if (!voiceEnabled) {
            console.warn('[useVoice] Voice disabled in settings.');
            return;
        }
        if (!('speechSynthesis' in window)) return;

        // Stop précédent
        window.speechSynthesis.cancel();

        // Nettoyage du texte pour la parole (Retire les ** du Markdown, etc.)
        const cleanText = text
            .replace(/\*\*/g, '')      // Retire le gras **
            .replace(/\*/g, '')        // Retire l'italique *
            .replace(/#{1,6}\s/g, '')  // Retire les headers #
            .replace(/`/g, '')         // Retire les backticks `
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // Garde le texte des liens [texte](url)

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'fr-FR';
        utterance.rate = 1.0;
        utterance.pitch = 1;

        // Appliquer la voix choisie ou défaut "Google"
        const voices = window.speechSynthesis.getVoices();

        if (voiceName) {
            const selectedVoice = voices.find(v => v.name === voiceName);
            if (selectedVoice) utterance.voice = selectedVoice;
        } else {
            // Tentative de trouver une voix Google Française par défaut
            const googleVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('fr'));
            if (googleVoice) utterance.voice = googleVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
        setMessage('🔊 Hologramme parle...');
    };

    const stopSpeech = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            useHoloStore.getState().setIsSpeaking(false);
        }
    };

    const getVoices = useCallback(() => {
        if ('speechSynthesis' in window) {
            return window.speechSynthesis.getVoices();
        }
        return [];
    }, []);

    return {
        isListening,
        startListening,
        stopListening,
        speak,
        stopSpeech,
        getVoices,
        isSupported: !!recognition
    };
};