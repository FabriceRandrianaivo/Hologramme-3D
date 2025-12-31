import { useState, useEffect } from 'react';
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
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fr-FR';
            utterance.rate = 1.0;
            utterance.pitch = 1;

            utterance.onstart = () => useHoloStore.getState().setIsSpeaking(true);
            utterance.onend = () => useHoloStore.getState().setIsSpeaking(false);
            utterance.onerror = () => useHoloStore.getState().setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
            setMessage('🔊 Hologramme parle...');
        } else {
            console.warn('Text-to-Speech non supporté');
        }
    };

    return {
        isListening,
        startListening,
        stopListening,
        speak,
        isSupported: !!recognition
    };
};