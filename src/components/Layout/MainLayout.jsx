import React from 'react';

export const MainLayout = ({ children }) => {
    return (
        <div className="w-full h-screen bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
            {/* Effet de grille de fond */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

            {/* Contenu principal */}
            {children}

            {/* Footer */}
            <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
                <p className="text-cyan-500/30 text-xs font-mono">
                    Hologram AI Project v1.0 • Architecture Modulaire
                </p>
            </div>
        </div>
    );
};