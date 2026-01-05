// Scene Component
import { Suspense } from 'react';
import { useHoloStore } from "../../store/holoStore";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { ANIMATION } from "../../utils/constants";
import HumanoidModel from "./HumanoidModel";
import HoloPlatform from "./HoloPlatform";
import HoloSphere from "./HoloSphere";

const Scene = () => {
  const { rotation, avatarType, visualMode } = useHoloStore();

  const isRealistic = visualMode === 'realistic';

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 1.2]} fov={35} />
      <OrbitControls
        enablePan={false}
        minDistance={0.5}
        maxDistance={12}
        autoRotate={rotation}
        autoRotateSpeed={ANIMATION.ROTATION_SPEED}
        target={[0, 0, 0]}
      />

      <ambientLight intensity={isRealistic ? 0.7 : 0.5} />
      <pointLight position={[2, 2, 2]} intensity={isRealistic ? 1.5 : 2} color={isRealistic ? "#ffffff" : "#00ffff"} />
      <pointLight position={[-2, 2, 2]} intensity={isRealistic ? 0.8 : 1.5} color={isRealistic ? "#ffffff" : "#00ffff"} />
      <spotLight position={[0, 2, 1]} angle={0.4} penumbra={1} intensity={isRealistic ? 2 : 5} color={isRealistic ? "#ffffff" : "#00ffff"} />
      <pointLight position={[0, 0, -2]} intensity={isRealistic ? 0.5 : 3} color={isRealistic ? "#ffffff" : "#00ffff"} /> {/* Rim Light */}

      <Suspense fallback={null}>
        {avatarType === 'face' ? <HumanoidModel /> : <HoloSphere />}
      </Suspense>

      <HoloPlatform />
    </>
  );
};

export default Scene;