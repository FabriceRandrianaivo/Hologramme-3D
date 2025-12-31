// Header Component

import { useHoloStore } from "../../store/holoStore";

const Header = () => {
  const { message } = useHoloStore();

  return (
    <div className="absolute top-0 left-0 right-0 p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 pointer-events-auto">
          <h1 className="text-2xl font-bold text-cyan-400 mb-2">
            🔮 Hologramme IA - Architecture Modulaire
          </h1>
          <p className="text-cyan-300/70 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
