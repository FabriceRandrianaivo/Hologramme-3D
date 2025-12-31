import { useState } from 'react';
import { useHoloStore } from '../store/holoStore';
import { useAIStore } from '../store/aiStore';
import { geminiService } from '../services/geminiService';

export const useAI = () => {
  const { setMessage, setIsThinking, addMessage: addChatMessage } = useHoloStore();
  const {
    messages,
    addMessage,
  } = useAIStore();

  const [error, setError] = useState(null);

  // Envoyer un message
  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    setIsThinking(true);
    setError(null);
    setMessage('IA en train de réfléchir...');

    // Ajouter le message de l'utilisateur
    addMessage({ role: 'user', content: userMessage });
    addChatMessage('user', userMessage);

    try {
      // 1. Récupération Clé API
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      // 2. Fallback Simulation (Si pas de clé)
      if (!apiKey) {
        console.warn("⚠️ Pas de clé VITE_GEMINI_API_KEY. Mode SIMULATION.");
        const response = await simulateAIResponse(userMessage);
        finalizeMessage(response);
        return;
      }

      // 3. Appel Gemini
      const { geminiModel } = useHoloStore.getState();
      const response = await geminiService.sendMessage(apiKey, geminiModel || 'gemini-2.5-flash', userMessage, messages);
      finalizeMessage(response);
      return response;

    } catch (err) {
      console.error(err);
      setError(err.message);
      setMessage('Erreur: ' + err.message);
    } finally {
      setIsThinking(false);
    }
  };

  // Helper pour finaliser l'état
  const finalizeMessage = (response) => {
    addMessage({ role: 'assistant', content: response });
    addChatMessage('assistant', response);
    setMessage(response);

    // Le TTS est géré par useVoice qui observe les changements si nécessaire,
    // ou on peut appeler speak() ici si on avait accès à useVoice.
    // Pour l'instant on laisse l'utilisateur lire ou on ajoutera le TTS explicite.
  };

  // Simulation de réponse IA
  const simulateAIResponse = (userMessage) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = [
          "Je suis un hologramme piloté par Gemini (Simulé). Comment puis-je vous aider ?",
          "Ceci est une réponse automatique car aucune clé API n'a été détectée.",
          "Pour activer ma vraie intelligence, ajoutez votre clé Gemini dans le fichier .env !"
        ];
        resolve(responses[Math.floor(Math.random() * responses.length)]);
      }, 1500);
    });
  };

  return {
    sendMessage,
    error,
    isThinking: useHoloStore((state) => state.isThinking)
  };
};