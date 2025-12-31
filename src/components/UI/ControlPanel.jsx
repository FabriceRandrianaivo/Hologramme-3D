// ControlPanel Component
import React from 'react';
import { useHoloStore } from "../../store/holoStore";
import { useHologram } from "../../hooks/useHologram";
import { useAI } from "../../hooks/useAI";


const ControlPanel = () => {
  const { aiActive, setAiActive } = useHoloStore();
  const { rotation, toggleRotation } = useHologram();
  const { sendMessage } = useAI();
  const [input, setInput] = React.useState('');

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Chat Input Removed - Moved to ChatInterface */}

        {/* Control Buttons */}
        <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 pointer-events-auto">
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setAiActive(!aiActive)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${aiActive
                ? 'bg-green-500/20 border-2 border-green-400 text-green-400'
                : 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-500/30'
                }`}
            >
              {aiActive ? '✓ IA Active' : 'Activer IA'}
            </button>

            <button
              onClick={toggleRotation}
              className="px-6 py-3 bg-purple-500/20 border-2 border-purple-400 text-purple-400 rounded-lg font-semibold hover:bg-purple-500/30 transition-all"
            >
              {rotation ? '⏸ Pause' : '▶ Rotation'}
            </button>

            <button
              className="px-6 py-3 bg-blue-500/20 border-2 border-blue-400 text-blue-400 rounded-lg font-semibold hover:bg-blue-500/30 transition-all"
              onClick={() => alert('Architecture modulaire prête !\n\nProchaine étape: Intégration API Claude')}
            >
              ℹ️ Info
            </button>
          </div>

          <div className="mt-4 text-center text-cyan-300/50 text-sm">
            <p>💡 Architecture modulaire • Prête pour l'IA • Scalable et robuste</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
