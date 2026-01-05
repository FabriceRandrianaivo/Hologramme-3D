import { useState, useEffect } from 'react';
import { useHoloStore } from '../../store/holoStore';
import { useVoice } from '../../hooks/useVoice';
import { COLORS, GEMINI_CONFIG } from '../../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPanel = () => {
    const {
        voiceName, setVoiceName,
        avatarType, setAvatarType,
        avatarDisplayMode, setAvatarDisplayMode,
        visualMode, setVisualMode,
        voiceEnabled, setVoiceEnabled,
        geminiModel, setGeminiModel,
        faceTrackingActive, setIsFaceTrackingActive,
        color, setColor
    } = useHoloStore();

    const { stopSpeech, getVoices } = useVoice();
    const [availableVoices, setAvailableVoices] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Charger les voix (parfois asynchrone)
        const loadVoices = () => {
            const voices = getVoices();
            setAvailableVoices(voices);
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, [getVoices]);

    return (
        <div className="absolute bottom-6 right-6 z-50 flex flex-col-reverse items-end pointer-events-none gap-4">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-cyan-950/40 border border-cyan-500/50 text-cyan-400 p-2 rounded-lg hover:bg-cyan-900/50 transition-all pointer-events-auto shadow-[0_0_10px_rgba(0,255,255,0.2)]"
            >
                <div className="flex items-center gap-2 font-orbitron text-xs">
                    <span className="w-2 h-2 bg-cyan-400 animate-pulse" />
                    CONFIG_SYS
                </div>
            </button>

            {/* Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="w-72 hud-panel p-4 pointer-events-auto flex flex-col gap-4"
                    >
                        <h3 className="text-cyan-400 font-orbitron text-sm border-b border-cyan-500/30 pb-2">
                            SYSTEM_PARAMETERS
                        </h3>

                        {/* Audio Controls */}
                        <div className="space-y-2">
                            <label className="text-cyan-200 text-xs font-rajdhani block">AUDIO_OUTPUT</label>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                                    className={`flex-1 py-1 px-2 rounded border text-xs font-orbitron transition-all ${voiceEnabled
                                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                                        : 'bg-red-500/20 border-red-500 text-red-300'
                                        }`}
                                >
                                    {voiceEnabled ? 'VOICE: ON' : 'VOICE: OFF'}
                                </button>

                                <button
                                    onClick={stopSpeech}
                                    className="px-3 py-1 rounded border border-red-500/60 bg-red-950/30 text-red-400 text-xs font-orbitron hover:bg-red-900/50"
                                    title="Arrêter la voix en cours"
                                >
                                    STOP ⬛
                                </button>
                            </div>

                            {/* Voice Selector */}
                            {voiceEnabled && (
                                <select
                                    value={voiceName || ''}
                                    onChange={(e) => setVoiceName(e.target.value)}
                                    className="w-full bg-black/40 border border-cyan-500/30 text-cyan-100 text-xs p-1 rounded font-rajdhani focus:outline-none focus:border-cyan-400"
                                >
                                    <option value="">-- Voix par défaut --</option>
                                    {availableVoices.map((v, i) => (
                                        <option key={i} value={v.name}>
                                            {v.name.slice(0, 30)} ({v.lang})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Avatar Controls */}
                        <div className="space-y-2">
                            <label className="text-cyan-200 text-xs font-rajdhani block">HOLO_FORM</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setAvatarType('face')}
                                    className={`py-2 border text-xs font-orbitron rounded transition-all ${avatarType === 'face'
                                        ? 'bg-cyan-500/30 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                                        : 'bg-black/40 border-cyan-900/50 text-cyan-700 hover:border-cyan-600'
                                        }`}
                                >
                                    HUMANOID
                                </button>
                                <button
                                    onClick={() => setAvatarType('sphere')}
                                    className={`py-2 border text-xs font-orbitron rounded transition-all ${avatarType === 'sphere'
                                        ? 'bg-cyan-500/30 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                                        : 'bg-black/40 border-cyan-900/50 text-cyan-700 hover:border-cyan-600'
                                        }`}
                                >
                                    ORB_CORE
                                </button>
                            </div>
                        </div>

                        {/* Display Mode Controls */}
                        {avatarType === 'face' && (
                            <div className="space-y-2">
                                <label className="text-cyan-200 text-xs font-rajdhani block">DISPLAY_MODE</label>
                                <div className="grid grid-cols-3 gap-1">
                                    <button
                                        onClick={() => setAvatarDisplayMode('head')}
                                        className={`py-1 border text-[9px] font-orbitron rounded transition-all ${avatarDisplayMode === 'head'
                                            ? 'bg-cyan-500/30 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                                            : 'bg-black/40 border-cyan-900/50 text-cyan-700 hover:border-cyan-600'
                                            }`}
                                    >
                                        HEAD
                                    </button>
                                    <button
                                        onClick={() => setAvatarDisplayMode('bust')}
                                        className={`py-1 border text-[9px] font-orbitron rounded transition-all ${avatarDisplayMode === 'bust'
                                            ? 'bg-cyan-500/30 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                                            : 'bg-black/40 border-cyan-900/50 text-cyan-700 hover:border-cyan-600'
                                            }`}
                                    >
                                        BUST
                                    </button>
                                    <button
                                        onClick={() => setAvatarDisplayMode('full')}
                                        className={`py-1 border text-[9px] font-orbitron rounded transition-all ${avatarDisplayMode === 'full'
                                            ? 'bg-cyan-500/30 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                                            : 'bg-black/40 border-cyan-900/50 text-cyan-700 hover:border-cyan-600'
                                            }`}
                                    >
                                        FULL
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Visual Mode Controls */}
                        <div className="space-y-2">
                            <label className="text-cyan-200 text-xs font-rajdhani block">VISUAL_STYLE</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setVisualMode('hologram')}
                                    className={`py-1 border text-[10px] font-orbitron rounded transition-all ${visualMode === 'hologram'
                                        ? 'bg-cyan-500/30 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                                        : 'bg-black/40 border-cyan-900/50 text-cyan-700 hover:border-cyan-600'
                                        }`}
                                >
                                    HOLOGRAM
                                </button>
                                <button
                                    onClick={() => setVisualMode('realistic')}
                                    className={`py-1 border text-[10px] font-orbitron rounded transition-all ${visualMode === 'realistic'
                                        ? 'bg-purple-500/30 border-purple-400 text-purple-100 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                                        : 'bg-black/40 border-cyan-900/50 text-cyan-700 hover:border-cyan-600'
                                        }`}
                                >
                                    REALISTIC
                                </button>
                            </div>
                        </div>

                        {/* Model Controls */}
                        <div className="space-y-2">
                            <label className="text-cyan-200 text-xs font-rajdhani block">AI_MODEL_CORE</label>
                            <select
                                value={geminiModel || GEMINI_CONFIG.DEFAULT_MODEL}
                                onChange={(e) => setGeminiModel(e.target.value)}
                                className="w-full bg-black/40 border border-cyan-500/30 text-cyan-100 text-xs p-1 rounded font-rajdhani focus:outline-none focus:border-cyan-400"
                            >
                                {GEMINI_CONFIG.MODELS.map((model) => (
                                    <option key={model.id} value={model.id}>
                                        {model.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Face Tracking Controls */}
                        <div className="space-y-2">
                            <label className="text-cyan-200 text-xs font-rajdhani block">EYE_SYNC (WEBCAM)</label>
                            <button
                                onClick={() => setIsFaceTrackingActive(!faceTrackingActive)}
                                className={`w-full py-1 rounded border text-xs font-orbitron transition-all ${faceTrackingActive
                                    ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                                    : 'bg-black/40 border-cyan-900/50 text-cyan-700 hover:border-cyan-600'
                                    }`}
                            >
                                {faceTrackingActive ? 'LINKED: ON 👁️' : 'LINKED: OFF'}
                            </button>
                        </div>

                        {/* Color Controls */}
                        <div className="space-y-2">
                            <label className="text-cyan-200 text-xs font-rajdhani block">HOLO_COLOR</label>
                            <div className="grid grid-cols-5 gap-1">
                                {Object.entries(COLORS).map(([name, value]) => (
                                    <button
                                        key={name}
                                        onClick={() => setColor(value)}
                                        className={`w-full h-6 rounded-sm border transition-all ${color === value ? 'border-white scale-110 shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        style={{ backgroundColor: value }}
                                        title={name}
                                    />
                                ))}
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SettingsPanel;
