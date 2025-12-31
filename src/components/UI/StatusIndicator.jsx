// StatusIndicator Component
import { useHoloStore } from "../../store/holoStore";

const StatusIndicator = () => {
  const { aiActive, isThinking } = useHoloStore();

  return (
    <div className="absolute top-6 right-6 space-y-2 pointer-events-none">
      <div className={`px-4 py-2 rounded-lg backdrop-blur-sm transition-all ${aiActive ? 'bg-green-500/20 border border-green-400' : 'bg-gray-500/20 border border-gray-400'
        }`}>
        <p className={`text-sm font-mono ${aiActive ? 'text-green-400' : 'text-gray-400'}`}>
          AI: {aiActive ? 'ACTIVE' : 'STANDBY'}
        </p>
      </div>

      {isThinking && (
        <div className="px-4 py-2 rounded-lg backdrop-blur-sm bg-blue-500/20 border border-blue-400 animate-pulse">
          <p className="text-sm font-mono text-blue-400">THINKING...</p>
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;
