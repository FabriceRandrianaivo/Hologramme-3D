import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { MainLayout } from './components/Layout/MainLayout';
import Scene from './components/3D/Scene';
import Header from './components/UI/Header';
import StatusIndicator from './components/UI/StatusIndicator';
import ControlPanel from './components/UI/ControlPanel';
import ChatInterface from './components/UI/ChatInterface';

export default function HologramApp() {
  return (
    <MainLayout>
      {/* Canvas 3D */}
      <Canvas shadows className="absolute inset-0">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <Header />
      <StatusIndicator />
      <ChatInterface />
      <ControlPanel />
    </MainLayout>
  );
}