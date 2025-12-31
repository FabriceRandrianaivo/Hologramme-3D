import { useRef, useEffect, useState } from 'react';
import { useHoloStore } from '../../store/holoStore';
import { useAI } from '../../hooks/useAI';
import { useVoice } from '../../hooks/useVoice';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface = () => {
    const { chatHistory, isThinking, aiActive } = useHoloStore();
    const { sendMessage } = useAI();
    const { isListening, startListening, stopListening, speak } = useVoice();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isThinking]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || !aiActive) return;

        const userText = input;
        setInput('');

        const response = await sendMessage(userText);
        if (response) {
            speak(response);
        }
    };

    // Callback pour la voix
    const handleVoiceResult = async (text) => {
        setInput(text);
        const response = await sendMessage(text);
        if (response) {
            speak(response);
        }
    };

    if (!aiActive) return null;

    return (
        <div className="absolute top-1/2 left-6 -translate-y-1/2 w-96 max-h-[600px] flex flex-col pointer-events-none">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col h-full bg-black/40 backdrop-blur-md rounded-xl border border-cyan-500/30 overflow-hidden shadow-[0_0_15px_rgba(0,255,255,0.1)] pointer-events-auto"
            >
                {/* Header Chat */}
                <div className="p-4 border-b border-cyan-500/20 bg-cyan-950/20">
                    <h3 className="text-cyan-400 font-mono text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        INTERFACE NEURONALE
                    </h3>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
                    <AnimatePresence>
                        {chatHistory.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div className={`
                  max-w-[85%] p-3 rounded-lg text-sm font-mono
                  ${msg.role === 'user'
                                        ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-100 rounded-tr-none'
                                        : 'bg-purple-500/20 border border-purple-500/40 text-purple-100 rounded-tl-none'}
                `}>
                                    {msg.content}
                                </div>
                                <span className="text-[10px] text-gray-500 mt-1 px-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </motion.div>
                        ))}

                        {isThinking && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2 text-cyan-400/60 text-xs font-mono p-2"
                            >
                                <span>TRAITEMENT</span>
                                <span className="flex gap-1">
                                    <span className="animate-bounce delay-0">.</span>
                                    <span className="animate-bounce delay-100">.</span>
                                    <span className="animate-bounce delay-200">.</span>
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-cyan-500/20 bg-black/40">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={isListening ? stopListening : () => startListening(handleVoiceResult)}
                            className={`px-3 rounded-lg border transition-all flex items-center justify-center ${isListening
                                ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
                                : 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/40'
                                }`}
                            title={isListening ? "Arrêter l'écoute" : "Activer le micro"}
                        >
                            {isListening ? '🛑' : '🎤'}
                        </button>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isListening ? "Écoute en cours..." : "Entrez votre commande..."}
                            className="flex-1 bg-cyan-950/20 border border-cyan-500/30 rounded-lg px-4 py-2 text-cyan-100 text-sm font-mono focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/60 placeholder-cyan-700/50"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 rounded-lg px-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ⏎
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ChatInterface;
