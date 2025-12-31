// Service pour l'API Google Gemini (REST)
export const geminiService = {
    async sendMessage(apiKey, userMessage, history = []) {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        // Formatage de l'historique pour Gemini
        // Gemini attend: { role: "user" | "model", parts: [{ text: "..." }] }
        const formattedHistory = history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Ajout du message actuel
        const contents = [
            ...formattedHistory,
            { role: 'user', parts: [{ text: userMessage }] }
        ];

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Erreur Gemini API');
            }

            const data = await response.json();
            // Extraction de la réponse texte
            const text = data.candidates[0].content.parts[0].text;
            return text;

        } catch (error) {
            console.error('Gemini Service Error:', error);
            throw error;
        }
    }
};
