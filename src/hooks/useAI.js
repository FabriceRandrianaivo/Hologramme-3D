import { useState } from 'react';
import { useHoloStore } from '../store/holoStore';
import { useAIStore } from '../store/aiStore';

export const useAI = () => {
  const { setMessage, setIsThinking, addMessage: addChatMessage } = useHoloStore();
  const {
    apiKey,
    model,
    messages,
    temperature,
    maxTokens,
    addMessage,
    setIsStreaming,
    setCurrentResponse
  } = useAIStore();

  const [error, setError] = useState(null);

  // Envoyer un message à l'API Claude
  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    setIsThinking(true);
    setError(null);
    setMessage('IA en train de réfléchir...');

    // Ajouter le message de l'utilisateur
    addMessage({ role: 'user', content: userMessage });
    addChatMessage('user', userMessage);

    try {
      // TODO: Remplacer par vraie API Claude
      // Pour l'instant, simulation
      const response = await simulateAIResponse(userMessage);

      addMessage({ role: 'assistant', content: response });
      addChatMessage('assistant', response);
      setMessage(response);

    } catch (err) {
      setError(err.message);
      setMessage('Erreur: ' + err.message);
    } finally {
      setIsThinking(false);
    }
  };

  // Simulation de réponse IA (à remplacer par vraie API)
  const simulateAIResponse = (userMessage) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = [
          "Je suis un hologramme IA. Comment puis-je vous aider ?",
          "Intéressant ! Pouvez-vous m'en dire plus ?",
          "Je comprends votre question. L'intégration de l'API Claude permettra des réponses plus sophistiquées.",
          "C'est une excellente question ! Je suis prêt à évoluer avec l'API complète."
        ];
        resolve(responses[Math.floor(Math.random() * responses.length)]);
      }, 1500);
    });
  };

  // Fonction pour intégrer la vraie API Claude (à développer)
  const sendToClaudeAPI = async (userMessage) => {
    if (!apiKey) {
      throw new Error('Clé API non configurée');
    }

    setIsStreaming(true);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: maxTokens,
        temperature: temperature,
        messages: [
          ...messages,
          { role: 'user', content: userMessage }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Erreur API: ' + response.statusText);
    }

    const data = await response.json();
    setIsStreaming(false);

    return data.content[0].text;
  };

  return {
    sendMessage,
    sendToClaudeAPI,
    error,
    isThinking: useHoloStore((state) => state.isThinking)
  };
};