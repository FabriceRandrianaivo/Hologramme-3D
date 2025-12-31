export class AIService {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    this.baseURL = '/api/anthropic';
    this.model = 'claude-sonnet-4-20250514';
  }

  // Configurer la clé API
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  // Envoyer un message
  async sendMessage(message, conversationHistory = []) {
    if (!this.apiKey) {
      throw new Error('API key non configurée');
    }

    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1000,
        messages: [
          ...conversationHistory,
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  // Streaming de la réponse
  async streamResponse(message, onChunk, conversationHistory = []) {
    if (!this.apiKey) {
      throw new Error('API key non configurée');
    }

    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1000,
        stream: true,
        messages: [
          ...conversationHistory,
          { role: 'user', content: message }
        ]
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      onChunk(chunk);
    }
  }
}

// Instance par défaut
export const aiService = new AIService();